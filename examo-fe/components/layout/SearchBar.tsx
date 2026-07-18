import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import COLORS from "@/constants/colors";
import { forwardRef, useEffect, useState } from "react";

interface SearchBarProps extends TextInputProps {}

const SearchBar = forwardRef<TextInput, SearchBarProps>((props, ref) => {
  const { style, onChangeText, value, ...restProps } = props;
  const [searchValue, setSearchValue] = useState<string>(value ?? "");

  useEffect(() => {
    const timeoutId = setTimeout(() => onChangeText?.(searchValue), 500);

    return () => clearTimeout(timeoutId);
  }, [value, onChangeText, searchValue]);

  return (
    <View style={styles.searchInputWrapper}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} />

      <TextInput
        ref={ref}
        style={[styles.searchInput, style]}
        placeholderTextColor={COLORS.textSecondary}
        value={searchValue}
        onChangeText={setSearchValue}
        {...restProps}
      />
    </View>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;

const styles = StyleSheet.create({
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
});
