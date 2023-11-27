export async function getData(
  id = 0,
  tileX = 0,
  tileY = 0,
  tileZ = 0,
  tileItemId = 0
) {
  const response = await fetch(
    `http://localhost:8080/test?id=${id}&tileX=${tileX}&tileY=${tileY}&tileZ=${tileZ}&tileItemId=${tileItemId}`,
    {
      method: "GET",
    }
  ).catch(console.log);
  return response.json();
}

export async function getInv() {
  const response = await fetch(`http://localhost:8080/inv`, {
    method: "GET",
  }).catch(console.log);
  return response.json();
}

export async function getPath(start, end) {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  headers.append("origin", "https://explv.github.io");
  headers.append("referer", "https://explv.github.io/");

  const raw = JSON.stringify({
    start,
    end,
    player: {
      members: true,
    },
  });

  return fetch("https://explv-map.siisiqf.workers.dev/", {
    method: "POST",
    body: raw,
    headers,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((res) => res.path)
    .catch(console.log);
}
