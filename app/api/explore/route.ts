import { executeQuery } from "@/lib/user-query-execution";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await executeQuery(body);
    console.log("executeQuery result: ", result);

    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
