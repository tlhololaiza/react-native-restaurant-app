import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { logoutUser, updateUserProfile } from "@/services/firebase";
import { useAuthStore } from "@/utils/authStore";
import { COLORS } from "@/utils/colors";
import {
  commonStyles,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, userProfile, setUser, setUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name ?? user?.displayName ?? "",
    surname: userProfile?.surname ?? "",
    email: userProfile?.email ?? user?.email ?? "",
    phone: userProfile?.phone ?? "",
    address: userProfile?.address ?? "",
    cardNumber: userProfile?.cardNumber ?? "",
    cardExpiry: userProfile?.cardExpiry ?? "",
    cardCVV: userProfile?.cardCVV ?? "",
  });

  const [editData, setEditData] = useState(profileData);

  // Keep local profile state in sync when auth store updates
  useEffect(() => {
    const pd = {
      name: userProfile?.name ?? user?.displayName ?? "",
      surname: userProfile?.surname ?? "",
      email: userProfile?.email ?? user?.email ?? "",
      phone: userProfile?.phone ?? "",
      address: userProfile?.address ?? "",
      cardNumber: userProfile?.cardNumber ?? "",
      cardExpiry: userProfile?.cardExpiry ?? "",
      cardCVV: userProfile?.cardCVV ?? "",
    };
    setProfileData(pd);
    setEditData(pd);
  }, [userProfile, user]);

  // Check if user is authenticated
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.replace("/(auth)/login");
      }
    }, [user]),
  );

  const updateField = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Not Logged In", "Please login to save your profile");
      return;
    }

    Alert.alert("Saving", "Saving profile changes...");
    setLoading(true);
    try {
      const updates = {
        name: editData.name,
        surname: editData.surname,
        phone: editData.phone,
        address: editData.address,
        cardNumber: editData.cardNumber,
        cardExpiry: editData.cardExpiry,
        cardCVV: editData.cardCVV,
      };

      await updateUserProfile(user.uid, updates);

      // Build a full profile object to store in the auth store.
      const updatedProfile = {
        uid: user.uid,
        email: user.email ?? editData.email,
        name: editData.name,
        surname: editData.surname,
        phone: editData.phone ?? "",
        address: editData.address ?? "",
        cardNumber: editData.cardNumber ?? "",
        cardHolder: userProfile?.cardHolder,
        cardExpiry: editData.cardExpiry ?? "",
        cardCVV: editData.cardCVV ?? "",
        createdAt: userProfile?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      };

      setProfileData(updatedProfile);
      setUserProfile(updatedProfile as any);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Save Failed",
        (error as any)?.message || "Failed to save profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: string;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldLabel}>
        <MaterialIcons name={icon as any} size={20} color={COLORS.primary} />
        <Text style={styles.fieldLabelText}>{label}</Text>
      </View>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <MaterialIcons name="edit" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.profileName}>
            {isEditing ? editData.name : profileData.name}{" "}
            {isEditing ? editData.surname : profileData.surname}
          </Text>
        </View>

        {!isEditing ? (
          <>
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <ProfileField
                label="Name"
                value={`${profileData.name} ${profileData.surname}`}
                icon="person"
              />
              <ProfileField
                label="Email"
                value={profileData.email}
                icon="mail"
              />
              <ProfileField
                label="Phone"
                value={profileData.phone}
                icon="phone"
              />
              <ProfileField
                label="Address"
                value={profileData.address}
                icon="location-on"
              />
            </View>

            {/* Payment Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Information</Text>
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <MaterialIcons
                    name="credit-card"
                    size={32}
                    color={COLORS.white}
                    style={{ marginBottom: SPACING.md }}
                  />
                  <Text style={styles.cardNumber}>
                    {profileData.cardNumber
                      ? profileData.cardNumber
                          .replace(/\s+/g, "")
                          .replace(/.(?=.{4})/g, "*")
                          .match(/.{1,4}/g)
                          ?.join(" ")
                      : ""}
                  </Text>
                  <View style={styles.cardDetails}>
                    <View>
                      <Text style={styles.cardLabel}>Expires</Text>
                      <Text style={styles.cardValue}>
                        {profileData.cardExpiry}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabel}>CVC</Text>
                      <Text style={styles.cardValue}>***</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <TouchableOpacity style={styles.preferenceItem}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.preferenceText}>Notifications</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceItem}>
                <MaterialIcons
                  name="security"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.preferenceText}>Security</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceItem}>
                <MaterialIcons name="help" size={20} color={COLORS.primary} />
                <Text style={styles.preferenceText}>Help & Support</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <Button
              title="Logout"
              onPress={handleLogout}
              loading={loading}
              variant="danger"
              fullWidth
              size="lg"
            />
          </>
        ) : (
          <>
            {/* Edit Form */}
            <View style={styles.editForm}>
              <View style={styles.row}>
                <InputField
                  label="First Name"
                  value={editData.name}
                  onChangeText={(value) => updateField("name", value)}
                  style={styles.halfInput}
                />
                <InputField
                  label="Last Name"
                  value={editData.surname}
                  onChangeText={(value) => updateField("surname", value)}
                  style={styles.halfInput}
                />
              </View>

              <InputField
                label="Email"
                value={editData.email}
                onChangeText={(value) => updateField("email", value)}
                keyboardType="email-address"
              />

              <InputField
                label="Phone"
                value={editData.phone}
                onChangeText={(value) => updateField("phone", value)}
                keyboardType="phone-pad"
              />

              <InputField
                label="Address"
                value={editData.address}
                onChangeText={(value) => updateField("address", value)}
              />

              <Text style={styles.sectionTitle}>Card Information</Text>

              <InputField
                label="Card Number"
                value={editData.cardNumber}
                onChangeText={(value) => updateField("cardNumber", value)}
                keyboardType="numeric"
              />

              <View style={styles.row}>
                <InputField
                  label="Expiry"
                  value={editData.cardExpiry}
                  onChangeText={(value) => updateField("cardExpiry", value)}
                  placeholder="MM/YY"
                  style={styles.halfInput}
                />
                <InputField
                  label="CVC"
                  value={editData.cardCVV}
                  onChangeText={(value) => updateField("cardCVV", value)}
                  keyboardType="numeric"
                  style={styles.halfInput}
                />
              </View>
            </View>

            {/* Save/Cancel Buttons */}
            <View style={styles.buttonGroup}>
              <Button
                title="Save Changes"
                onPress={handleSaveChanges}
                fullWidth
                size="lg"
              />
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                fullWidth
                size="lg"
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    ...commonStyles.centered,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  fieldContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  fieldLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  fieldLabelText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  fieldValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  cardContainer: {
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  cardNumber: {
    ...TYPOGRAPHY.h4,
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: SPACING.xs,
  },
  cardValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  preferenceText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  editForm: {
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  buttonGroup: {
    gap: SPACING.lg,
  },
});
