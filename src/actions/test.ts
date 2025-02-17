"use server"

// We can use schema here with no problem, but you CANT export other thing than server actions

export const testFunction = () => "ok"
export const testParamFunction = (param: string) => 500
export const testParamFunction2 = ({ a, b }: { a: boolean, b: string }) => "ok"