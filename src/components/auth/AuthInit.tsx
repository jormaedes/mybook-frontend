'use client';
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth";

export default function AuthInit() {

	useEffect(()=> {
		useAuthStore.getState().init();
	}, []);
	return null;
}