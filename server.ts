import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://2152435c24526282fa673ca8ceb0eef1b0fb83bccb47fadaecf901444d009d46:sk_Jmk1lofvpfiUNhxSRsExr@db.prisma.io:5432/postgres?sslmode=require",
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth Routes
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

app.post('/api/sales', async (req, res) => {
  const { clientName, value, stage, salespersonId, description, ownerId } = req.body;
  try {
    const id = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await pool.query(
      `INSERT INTO "Sale" (id, "clientName", value, stage, "salespersonId", description, "ownerId", "updatedAt", "createdAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
       RETURNING *`,
      [id, clientName, Number(value), stage, Number(salespersonId), description, ownerId]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('SERVER ERROR CREATE SALE:', error);
    res.status(500).json({ error: 'Erro ao criar venda' });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "salespersonId" as id, SUM(value) as "totalValue", COUNT(*) as count 
       FROM "Sale" 
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
