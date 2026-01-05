export type ChangePasswordCopy = {
  title?: string;
  description?: string;
  currentPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  requirements?: string[];
  strengthLabel?: string;
  strength?: {
    weak?: string;
    medium?: string;
    strong?: string;
  };
  submit?: string;
  submitting?: string;
  success?: string;
  error?: string;
  errors?: {
    currentRequired?: string;
    newRequired?: string;
    mismatch?: string;
    samePassword?: string;
  };
};

export type SettingsHeroCopy = {
  badge?: string;
  title?: string;
  subtitle?: string;
  statusPill?: string;
  lastUpdatedLabel?: string;
  neverUpdated?: string;
  activeDevicesTitle?: string;
  activeDevicesHelper?: string;
};

export type SettingsTipsCopy = {
  title?: string;
  subtitle?: string;
  items?: string[];
  supportCta?: string;
};

export type SettingsCopy = {
  hero?: SettingsHeroCopy;
  changePassword?: ChangePasswordCopy;
  tips?: SettingsTipsCopy;
  signInCta?: string;
};

export type FormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ValidationError = Partial<Record<keyof FormState, string>>;
