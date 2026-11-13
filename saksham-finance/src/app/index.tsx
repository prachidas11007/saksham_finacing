// TEMP-DEMO
import { useState } from "react";
import { StyleSheet } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AppText } from "../components/AppText";
import { Banner } from "../components/Banner";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenContainer } from "../components/ScreenContainer";
import { BUDGET_WARNING_PERCENT, MAX_NOTE_LENGTH } from "../constants/limits";
import { spacing } from "../constants/theme";
import { usePreferences } from "../context/PreferencesContext";

export default function TempDemoScreen() {
  const { simpleMode, largeText, setSimpleMode, setLargeText } =
    usePreferences();
  const [note, setNote] = useState("");

  return (
    <ScreenContainer scroll keyboardSafe>
      <AppText variant="heading">Component demo</AppText>
      <Banner
        variant="info"
        message="Temporary demo screen for the shared base components."
      />

      <Card style={styles.section}>
        <AppText variant="title">Text</AppText>
        <AppText variant="heading">Heading text</AppText>
        <AppText variant="title">Title text</AppText>
        <AppText variant="body">
          Body text wraps when the screen is narrow or the phone font size grows.
        </AppText>
        <AppText variant="caption">Caption text</AppText>
      </Card>

      <Card style={styles.section}>
        <AppText variant="title">Buttons</AppText>
        <AppButton label="Primary button" icon="add-circle" onPress={() => {}} />
        <AppButton
          label="Secondary button"
          variant="secondary"
          icon="book"
          onPress={() => {}}
        />
        <AppButton
          label="Danger button"
          variant="danger"
          icon="trash"
          fullWidth
          onPress={() => {}}
        />
        <AppButton
          label={largeText ? "Turn off Large Text" : "Turn on Large Text"}
          variant="secondary"
          fullWidth
          onPress={() => setLargeText(!largeText)}
        />
        <AppButton
          label={simpleMode ? "Turn off Simple Mode" : "Turn on Simple Mode"}
          variant="secondary"
          fullWidth
          onPress={() => setSimpleMode(!simpleMode)}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="title">Progress</AppText>
        <ProgressBar
          value={BUDGET_WARNING_PERCENT}
          text={`${BUDGET_WARNING_PERCENT} percent`}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="title">Input</AppText>
        <AppInput
          label="Note"
          hint="Do not type bank details here."
          placeholder="Write a short note"
          maxLength={MAX_NOTE_LENGTH}
          value={note}
          onChangeText={setNote}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="title">Empty state</AppText>
        <EmptyState
          icon="wallet-outline"
          title="No entries yet"
          message="Add your first tracked demo amount."
          action={<AppButton label="Add expense" onPress={() => {}} />}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="title">Banners</AppText>
        <Banner variant="info" message="Information message." />
        <Banner variant="warning" message="Warning message." />
        <Banner variant="danger" message="Danger message." />
        <Banner variant="success" message="Success message." />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
});
