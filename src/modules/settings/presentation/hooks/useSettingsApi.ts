"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {PlatformSettingsDTO,UpdatePlatformSettingsDTO} from "@/modules/settings/domain/dto/PlatformSettingsDTO";

interface SettingsApiError extends Error {status?:number}
async function readJson(response:Response):Promise<PlatformSettingsDTO>{
  const payload:unknown=await response.json();
  if(!payload||typeof payload!=="object")throw new Error("Respons server tidak valid.");
  const envelope=payload as {success?:boolean;data?:PlatformSettingsDTO;error?:{message?:string}};
  if(!response.ok||!envelope.success||!envelope.data){
    const error:SettingsApiError=new Error(envelope.error?.message??"Permintaan pengaturan gagal.");
    error.status=response.status;
    throw error;
  }
  return envelope.data;
}

export function useSettingsApi(initial:PlatformSettingsDTO){
  const [snapshot,setSnapshot]=useState(initial);
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(false);
  const [conflict,setConflict]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const mounted=useRef(true);
  const requestId=useRef(0);
  useEffect(()=>()=>{mounted.current=false;requestId.current+=1},[]);
  const refresh=useCallback(async()=>{
    const id=++requestId.current;
    setLoading(true);
    try{
      const result=await readJson(await fetch("/api/settings",{cache:"no-store"}));
      if(mounted.current&&requestId.current===id){setSnapshot(result);setError(null);setConflict(false)}
      return result;
    }catch(e){
      if(mounted.current&&requestId.current===id)setError(e instanceof Error?e.message:"Gagal memuat pengaturan.");
      throw e;
    }finally{if(mounted.current&&requestId.current===id)setLoading(false)}
  },[]);
  const save=useCallback(async(data:UpdatePlatformSettingsDTO)=>{
    setSaving(true);
    setError(null);
    try{
      const result=await readJson(await fetch("/api/settings",{
        method:"PATCH",cache:"no-store",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data),
      }));
      if(mounted.current){setSnapshot(result);setConflict(false)}
      return result;
    }catch(e){
      if(mounted.current){
        setError(e instanceof Error?e.message:"Gagal menyimpan pengaturan.");
        setConflict((e as SettingsApiError).status===409);
      }
      throw e;
    }finally{if(mounted.current)setSaving(false)}
  },[]);
  return {snapshot,saving,loading,conflict,error,refresh,save};
}
