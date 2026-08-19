import {
  Bell,
  Building2,
  Check,
  LockKeyhole,
  Palette,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

type SettingsTab =
  | "GENERAL"
  | "APPEARANCE"
  | "NOTIFICATIONS"
  | "SECURITY";

export default function Settings() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("GENERAL");

  const [saved, setSaved] =
    useState(false);

  const [companyName, setCompanyName] =
    useState("Mini ERP");

  const [email, setEmail] =
    useState("admin@minierp.com");

  const [phone, setPhone] =
    useState("+91 98765 43210");

  const [gstNumber, setGstNumber] =
    useState("29ABCDE1234F1Z5");

  const [address, setAddress] =
    useState(
      "Bengaluru, Karnataka, India",
    );

  const [lowStockAlerts, setLowStockAlerts] =
    useState(true);

  const [invoiceNotifications, setInvoiceNotifications] =
    useState(true);

  const [followUpReminders, setFollowUpReminders] =
    useState(true);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your ERP preferences,
          company information and
          security settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        {/* Settings navigation */}

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2">
          <SettingsNavItem
            icon={Building2}
            label="General"
            active={
              activeTab === "GENERAL"
            }
            onClick={() =>
              setActiveTab("GENERAL")
            }
          />

          <SettingsNavItem
            icon={Palette}
            label="Appearance"
            active={
              activeTab ===
              "APPEARANCE"
            }
            onClick={() =>
              setActiveTab(
                "APPEARANCE",
              )
            }
          />

          <SettingsNavItem
            icon={Bell}
            label="Notifications"
            active={
              activeTab ===
              "NOTIFICATIONS"
            }
            onClick={() =>
              setActiveTab(
                "NOTIFICATIONS",
              )
            }
          />

          <SettingsNavItem
            icon={LockKeyhole}
            label="Security"
            active={
              activeTab ===
              "SECURITY"
            }
            onClick={() =>
              setActiveTab("SECURITY")
            }
          />
        </aside>

        {/* Content */}

        <section className="min-w-0">
          {activeTab ===
            "GENERAL" && (
            <GeneralSettings
              companyName={
                companyName
              }
              setCompanyName={
                setCompanyName
              }
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              gstNumber={gstNumber}
              setGstNumber={
                setGstNumber
              }
              address={address}
              setAddress={setAddress}
            />
          )}

          {activeTab ===
            "APPEARANCE" && (
            <AppearanceSettings />
          )}

          {activeTab ===
            "NOTIFICATIONS" && (
            <NotificationSettings
              lowStockAlerts={
                lowStockAlerts
              }
              setLowStockAlerts={
                setLowStockAlerts
              }
              invoiceNotifications={
                invoiceNotifications
              }
              setInvoiceNotifications={
                setInvoiceNotifications
              }
              followUpReminders={
                followUpReminders
              }
              setFollowUpReminders={
                setFollowUpReminders
              }
            />
          )}

          {activeTab ===
            "SECURITY" && (
            <SecuritySettings />
          )}

          {/* Save */}

          {activeTab !==
            "SECURITY" && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {saved && (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" />
                  Changes saved
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS NAV ITEM
   ========================================================= */

interface SettingsNavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SettingsNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: SettingsNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        text-left text-sm font-medium
        transition
        ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }
      `}
    >
      <Icon
        className={`h-4 w-4 ${
          active
            ? "text-indigo-600"
            : "text-slate-400"
        }`}
      />

      {label}
    </button>
  );
}

/* =========================================================
   GENERAL
   ========================================================= */

interface GeneralSettingsProps {
  companyName: string;
  setCompanyName: (
    value: string,
  ) => void;

  email: string;
  setEmail: (
    value: string,
  ) => void;

  phone: string;
  setPhone: (
    value: string,
  ) => void;

  gstNumber: string;
  setGstNumber: (
    value: string,
  ) => void;

  address: string;
  setAddress: (
    value: string,
  ) => void;
}

function GeneralSettings({
  companyName,
  setCompanyName,
  email,
  setEmail,
  phone,
  setPhone,
  gstNumber,
  setGstNumber,
  address,
  setAddress,
}: GeneralSettingsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Company Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Basic information used
              throughout the ERP.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
        <SettingsInput
          label="Company Name"
          value={companyName}
          onChange={
            setCompanyName
          }
        />

        <SettingsInput
          label="Business Email"
          type="email"
          value={email}
          onChange={setEmail}
        />

        <SettingsInput
          label="Phone Number"
          value={phone}
          onChange={setPhone}
        />

        <SettingsInput
          label="GST Number"
          value={gstNumber}
          onChange={setGstNumber}
        />

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Business Address
          </label>

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(
                event.target.value,
              )
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APPEARANCE
   ========================================================= */

function AppearanceSettings() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <Palette className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Appearance
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Customize the visual
              appearance of your ERP.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-slate-800">
            Theme
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your current application
            theme.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-indigo-500 bg-white p-4">
            <div className="h-20 rounded-lg border border-slate-200 bg-slate-50">
              <div className="h-5 border-b border-slate-200 bg-white" />
              <div className="flex gap-2 p-2">
                <div className="h-12 w-1/4 rounded bg-slate-200" />
                <div className="h-12 flex-1 rounded bg-white" />
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Light
            </p>

            <p className="text-xs text-slate-500">
              Current theme
            </p>
          </div>

          <div className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60">
            <div className="h-20 rounded-lg bg-slate-900">
              <div className="h-5 border-b border-slate-700" />
              <div className="flex gap-2 p-2">
                <div className="h-12 w-1/4 rounded bg-slate-800" />
                <div className="h-12 flex-1 rounded bg-slate-800" />
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Dark
            </p>

            <p className="text-xs text-slate-400">
              Coming later
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-indigo-50 p-4">
          <p className="text-sm font-medium text-indigo-800">
            Theme customization
          </p>

          <p className="mt-1 text-xs leading-5 text-indigo-600">
            The current ERP interface uses
            the default light theme.
            Additional themes can be
            enabled later.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

interface NotificationSettingsProps {
  lowStockAlerts: boolean;
  setLowStockAlerts: (
    value: boolean,
  ) => void;

  invoiceNotifications: boolean;
  setInvoiceNotifications: (
    value: boolean,
  ) => void;

  followUpReminders: boolean;
  setFollowUpReminders: (
    value: boolean,
  ) => void;
}

function NotificationSettings({
  lowStockAlerts,
  setLowStockAlerts,
  invoiceNotifications,
  setInvoiceNotifications,
  followUpReminders,
  setFollowUpReminders,
}: NotificationSettingsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Notifications
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Choose which business events
              should notify you.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <NotificationRow
          title="Low Stock Alerts"
          description="Notify when a product falls below its reorder level."
          checked={lowStockAlerts}
          onChange={
            setLowStockAlerts
          }
        />

        <NotificationRow
          title="Invoice Notifications"
          description="Receive notifications when invoices are generated or updated."
          checked={
            invoiceNotifications
          }
          onChange={
            setInvoiceNotifications
          }
        />

        <NotificationRow
          title="Follow-up Reminders"
          description="Receive reminders for upcoming customer follow-ups."
          checked={
            followUpReminders
          }
          onChange={
            setFollowUpReminders
          }
        />
      </div>
    </div>
  );
}

interface NotificationRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean,
  ) => void;
}

function NotificationRow({
  title,
  description,
  checked,
  onChange,
}: NotificationRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative h-6 w-11 shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-indigo-600"
              : "bg-slate-200"
          }
        `}
      >
        <span
          className={`
            absolute top-1
            h-4 w-4 rounded-full
            bg-white shadow-sm
            transition-transform
            ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />
      </button>
    </div>
  );
}

/* =========================================================
   SECURITY
   ========================================================= */

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Change Password
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <SettingsInput
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={
              setCurrentPassword
            }
          />

          <SettingsInput
            label="New Password"
            type="password"
            value={newPassword}
            onChange={
              setNewPassword
            }
          />

          <SettingsInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={
              setConfirmPassword
            }
          />

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <LockKeyhole className="h-4 w-4" />
            Update Password
          </button>
        </div>
      </div>

      {/* Account security */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Account Security
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your account is currently
              protected by standard
              authentication.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-slate-400" />

            <div>
              <p className="text-xs font-medium text-slate-700">
                Current session
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                This device · Active now
              </p>
            </div>

            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
   ========================================================= */

interface SettingsInputProps {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  type?: string;
}

function SettingsInput({
  label,
  value,
  onChange,
  type = "text",
}: SettingsInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
}