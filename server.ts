import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth Routes
app.get('/api/sellers', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, "salespersonId" FROM "User" WHERE role = $1 ORDER BY "salespersonId" ASC', ['seller']);
    res.json(result.rows);
  } catch (error) {
    console.error('SERVER ERROR FETCH SELLERS:', error);
    res.status(500).json({ error: 'Erro ao buscar vendedores' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, role, password } = req.body;
  
  try {
    let finalSalespersonId = null;

    if (role === 'seller') {
      const maxIdResult = await pool.query('SELECT MAX("salespersonId") as max_id FROM "User" WHERE role = $1', ['seller']);
      const currentMax = maxIdResult.rows[0].max_id || 0;
      finalSalespersonId = currentMax + 1;
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Note: Password is not currently being stored or hashed as per previous context, 
    // but the backend accepts it. If strict auth was needed we'd hash it here.
    
    const result = await pool.query(
      `INSERT INTO "User" (id, name, email, role, "salespersonId", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (email) DO UPDATE SET name = $2, role = $4, "salespersonId" = COALESCE("User"."salespersonId", $5), "updatedAt" = NOW()
       RETURNING *`,
      [id, name, email, role, finalSalespersonId]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('SERVER ERROR REGISTER:', error);
    res.status(500).json({ error: error.message || 'Erro ao registrar usuário' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Optional: Delete associated sales first if needed, or rely on CASCADE if configured.
    // For now, we just delete the user.
    const result = await pool.query('DELETE FROM "User" WHERE "salespersonId" = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error: any) {
    console.error('SERVER ERROR DELETE USER:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

app.patch('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { stage, value } = req.body;
  try {
    let result;
    if (stage !== undefined && value !== undefined) {
      result = await pool.query(
        'UPDATE "Sale" SET stage = $1, value = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
        [stage, Number(value), id]
      );
    } else if (stage !== undefined) {
      result = await pool.query(
        'UPDATE "Sale" SET stage = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
        [stage, id]
      );
    } else {
      result = await pool.query(
        'UPDATE "Sale" SET value = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
        [Number(value), id]
      );
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar venda' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('SERVER ERROR LOGIN:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Sales Routes
app.get('/api/sales', async (req, res) => {
  const { role, salespersonId } = req.query;
  try {
    let query = 'SELECT * FROM "Sale"';
    let params = [];
    if (role === 'seller' && salespersonId) {
      query += ' WHERE "salespersonId" = $1';
      params.push(Number(salespersonId));
    }
    query += ' ORDER BY "createdAt" DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('SERVER ERROR FETCH SALES:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "Sale" WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json({ message: 'Venda excluída com sucesso' });
  } catch (error) {
    console.error('SERVER ERROR DELETE SALE:', error);
    res.status(500).json({ error: 'Erro ao excluir venda' });
  }
});

app.post('/api/sales', async (req, res) => {
  console.log('DEBUG: Received Sale Request', req.body);
  const { clientName, value, stage, salespersonId, description, ownerId } = req.body;
  
  if (!ownerId) {
    console.error('DEBUG: Missing ownerId');
    return res.status(400).json({ error: 'Missing ownerId' });
  }

  try {
    const id = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('DEBUG: Attempting to insert sale', { id, clientName, value, stage, salespersonId, ownerId });
    
    const result = await pool.query(
      `INSERT INTO "Sale" (id, "clientName", value, stage, "salespersonId", description, "ownerId", "updatedAt", "createdAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
       RETURNING *`,
      [id, clientName, Number(value), stage, Number(salespersonId), description, ownerId]
    );
    console.log('DEBUG: Sale inserted successfully', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('SERVER ERROR CREATE SALE:', error);
    res.status(500).json({ error: 'Erro ao criar venda: ' + error.message });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "salespersonId" as id, SUM(value) as "totalValue", COUNT(*) as count 
       FROM "Sale" 
       WHERE stage IN ('fechamento', 'acompanhamento')
       GROUP BY "salespersonId" 
       ORDER BY "totalValue" DESC`
    );
    res.json(result.rows.map(r => ({ 
      id: Number(r.id), 
      totalValue: Number(r.totalValue || 0), 
      count: Number(r.count || 0) 
    })));
  } catch (error: any) {
    console.error('SERVER ERROR RANKING:', error);
    res.status(500).json({ error: 'Erro ao gerar ranking' });
  }
});

app.get('/api/general-goal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "GeneralGoal" ORDER BY "createdAt" DESC LIMIT 1');
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('SERVER ERROR FETCH GOAL:', error);
    res.status(500).json({ error: 'Erro ao buscar meta geral' });
  }
});

app.post('/api/general-goal', async (req, res) => {
  const { value } = req.body;
  try {
    const id = `goal_${Date.now()}`;
    const result = await pool.query(
      'INSERT INTO "GeneralGoal" (id, value, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [id, Number(value)]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('SERVER ERROR SET GOAL:', error);
    res.status(500).json({ error: 'Erro ao definir meta geral' });
  }
});

// Export for Vercel
export default app;

// Start server locally (if not in Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
