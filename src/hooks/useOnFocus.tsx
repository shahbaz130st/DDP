import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

export const useOnFocus = (onFocus: (isFocused: boolean) => void) => {
    const isFocused = useIsFocused();

    useEffect(() => {
        onFocus(isFocused);
    }, [isFocused]);
}