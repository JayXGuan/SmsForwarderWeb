import PocketBase from "pocketbase";

const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

export const pb = new PocketBase(POCKETBASE_URL);

// 初始化时检测数据库连接
(async () => {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("✅ PocketBase 数据库连接成功");
    } else {
      console.error(`❌ PocketBase 数据库连接失败: HTTP ${response.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    console.error(
      `❌ 无法连接到 PocketBase 数据库 (${POCKETBASE_URL}): ${errorMessage}`,
    );
  }
})();

export default pb;
