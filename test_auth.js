const { spawn } = require('child_process');

console.log('Starting dev server...');
const server = spawn('npm', ['run', 'dev'], { cwd: '/home/miki-liland/RECIPE/frontend' });

server.stdout.on('data', async (data) => {
  const output = data.toString();
  console.log(output);
  if (output.includes('Ready in') || output.includes('Local:')) {
    console.log('Server is ready. Testing auth flow...');
    
    // Allow an extra 3 seconds for compilation
    setTimeout(async () => {
        try {
            // LOGIN
            const loginBody = JSON.stringify({ email: "test10@example.com", password: "testpassword123" });
            console.log('Logging in...');
            const loginRes = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: loginBody
            });
            console.log('Login status:', loginRes.status);
            const loginJson = await loginRes.json();
            console.log('Login json:', loginJson);
            
            const cookies = loginRes.headers.get("set-cookie");
            console.log("Set-Cookie:", cookies);

            // ME
            console.log('Fetching /api/proxy/user/me/');
            const headers = new Headers();
            if (cookies) {
                headers.append("Cookie", cookies.split(";")[0]); // Simplified cookie handling
            }
            const meRes = await fetch("http://localhost:3000/api/proxy/user/me/?_cb=123", {
                headers
            });
            console.log('Me status:', meRes.status);
            const meJson = await meRes.text();
            console.log('Me body:', meJson);
            
            server.kill();
            process.exit(0);
        } catch (e) {
            console.error(e);
            server.kill();
            process.exit(1);
        }
    }, 5000);
  }
});

server.stderr.on('data', (err) => console.error(err.toString()));

setTimeout(() => { console.log('Timeout'); server.kill(); process.exit(1); }, 30000);
