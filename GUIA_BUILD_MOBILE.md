# Guia Técnico: Build e Implementação Mobile

Este guia fornece os passos exatos para transformar seu código atual em um aplicativo funcional, seja via link direto (PWA) ou arquivo de instalação (.apk).

---

## 🚀 Opção 1: Distribuição PWA (Recomendado)
A forma mais leve e rápida. O usuário instala o app diretamente do navegador.

### 1. Preparar o Build de Produção
No seu terminal, execute:
```bash
npm run build
```
Isso gerará a pasta `dist` com todos os arquivos otimizados e o Service Worker do PWA.

### 2. Deploy (Hospedagem)
Para que o PWA funcione, ele **precisa ser servido via HTTPS**. Recomendações:
- **Vercel / Netlify**: Basta conectar seu repositório GitHub. O deploy é automático.
- **Servidor Próprio**: Garanta que o certificado SSL esteja ativo e aponte para a pasta `dist`.

---

## 📱 Opção 2: Gerar APK Nativo (Capacitor)
Use esta opção se precisar enviar o arquivo `.apk` para alguém ou subir na Google Play Store.

### 1. Instalar o Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Vendas Pro" "com.barbermaps.vendaspro" --web-dir dist
```

### 2. Adicionar a Plataforma Android
```bash
npx cap add android
```

### 3. Sincronizar o Código
Sempre que fizer mudanças no código Web, rode:
```bash
npm run build
npx cap copy
```

### 4. Gerar o APK (via Android Studio)
1. Rode `npx cap open android`. O Android Studio abrirá o projeto.
2. Vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. O Android Studio gerará o arquivo que você pode instalar no seu celular.

---

## 🛠️ Manutenção e Escalabilidade
- **Atualização do PWA**: Sempre que você fizer um novo deploy, o Service Worker detectará a mudança e o app se atualizará automaticamente no celular do usuário (configurado como `autoUpdate` no `vite.config.ts`).
- **Fail-Safe**: As validações Zod em `src/utils/validation.ts` garantem que, mesmo em dispositivos mais lentos, os dados inseridos sejam íntegros antes de tentar qualquer envio.

---

> [!TIP]
> **Dica de UX:** No PWA, o navegador pode ocultar o aviso de "Adicionar à tela inicial" após a primeira visualização. Você pode criar um botão no seu app usando o evento `beforeinstallprompt` para incentivar a instalação.
