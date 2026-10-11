import "server-only";
import { revalidatePath } from "next/cache";
import { createSettingsUseCases } from "@/app/api/settings/_factory";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";

const headers = {"Cache-Control":"private, no-store","Vary":"Cookie, Authorization"};

function failure(error:unknown):Response {
  if(error instanceof Error && "statusCode" in error && error.statusCode === 409) {
    return Response.json(ApiResponse.error("SETTINGS_CONFLICT",error.message,409).body,{status:409,headers});
  }
  const mapped=mapErrorToHttpResponse(error);
  return Response.json(mapped.body,{status:mapped.status,headers});
}
export async function GET(request:Request):Promise<Response> {
  try {
    const actor=await resolveCurrentActor(request);
    const data=await createSettingsUseCases().read.execute(actor);
    return Response.json(ApiResponse.success(data).body,{headers});
  }catch(error){return failure(error)}
}
export async function PATCH(request:Request):Promise<Response> {
  try {
    const actor=await resolveCurrentActor(request);
    const input:unknown=await request.json();
    const data=await createSettingsUseCases().update.execute(actor,input);
    revalidatePath("/", "layout");
    revalidatePath("/manifest.webmanifest");
    return Response.json(ApiResponse.success(data).body,{headers});
  }catch(error){return failure(error)}
}
