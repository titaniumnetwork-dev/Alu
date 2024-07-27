export async function testWispServers(servers: WispServer[]): Promise<WispData[]> {
  const wispData: WispData[] = [];

  for (const server of servers) {
    const start = performance.now();

    try {
      await new Promise((resolve, reject) => {
        const socket = new WebSocket(server.url);

        socket.onopen = () => {
          const end = performance.now();
          console.log(`Connected to ${server.url} in ${end - start}ms`);
          const data = {
            server: server,
            time: end - start,
          };
          wispData.push(data);
          socket.close();
          resolve(null);
        };

        socket.onerror = (error) => {
          reject(error);
        };
      });
    } catch (error) {
      console.error(`Failed to connect to ${server.url}`, error);
    }
  }

  if (wispData.length === servers.length) {
    return wispData;
  } else {
    throw new Error("Failed to connect to all servers");
  }
}

window.wispData = await testWispServers([
  {
    url: "wss://aluu.xyz/wisp/",
  },
  {
    url: "wss://nebulaproxy.io/wisp/",
  },
]);

console.log(window.wispData);
