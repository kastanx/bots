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
