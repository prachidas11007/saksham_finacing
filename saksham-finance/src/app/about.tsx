import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "../components/AppText";
import { Card } from "../components/Card";
import { ScreenContainer } from "../components/ScreenContainer";
import { spacing } from "../constants/theme";

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Card style={styles.card}>
          <AppText variant="body">{t("about.intro")}</AppText>
          <AppText variant="body">{t("about.notBank")}</AppText>
          <AppText variant="body">{t("about.localData")}</AppText>
          <AppText variant="body">{t("about.notVault")}</AppText>
          <AppText variant="body">{t("about.verify")}</AppText>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
});
