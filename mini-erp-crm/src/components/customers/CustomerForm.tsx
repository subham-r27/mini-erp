import {
    useEffect,
    useState,
  } from "react";
  
  import type {
    Customer,
    CustomerStatus,
    CustomerType,
  } from "../../types";
  
  import Button from "../ui/Button";
  import FormField from "../ui/FormField";
  import SelectField from "../ui/SelectField";
  import TextAreaField from "../ui/TextAreaField";
  
  interface CustomerFormProps {
    customer?: Customer | null;
    onSubmit: (
      customer: Omit<
        Customer,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => void;
    onCancel: () => void;
  }
  
  interface CustomerFormData {
    customerName: string;
    businessName: string;
    mobile: string;
    email: string;
    gstNumber: string;
    customerType: CustomerType;
    status: CustomerStatus;
    address: string;
    followUpDate: string;
    notes: string;
  }
  
  const emptyForm: CustomerFormData = {
    customerName: "",
    businessName: "",
    mobile: "",
    email: "",
    gstNumber: "",
    customerType: "RETAIL",
    status: "LEAD",
    address: "",
    followUpDate: "",
    notes: "",
  };
  
  export default function CustomerForm({
    customer,
    onSubmit,
    onCancel,
  }: CustomerFormProps) {
    const [form, setForm] =
      useState<CustomerFormData>(emptyForm);
  
    const [errors, setErrors] = useState<
      Record<string, string>
    >({});
  
    const [loading, setLoading] =
      useState(false);
  
    const isEditing = Boolean(customer);
  
    useEffect(() => {
      if (customer) {
        setForm({
          customerName:
            customer.customerName,
          businessName:
            customer.businessName,
          mobile: customer.mobile,
          email: customer.email,
          gstNumber:
            customer.gstNumber || "",
          customerType:
            customer.customerType,
          status: customer.status,
          address: customer.address,
          followUpDate:
            customer.followUpDate || "",
          notes: customer.notes || "",
        });
      } else {
        setForm(emptyForm);
      }
  
      setErrors({});
    }, [customer]);
  
    const updateField = (
      field: keyof CustomerFormData,
      value: string,
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
  
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    };
  
    const validate = () => {
      const nextErrors: Record<
        string,
        string
      > = {};
  
      if (!form.customerName.trim()) {
        nextErrors.customerName =
          "Customer name is required.";
      }
  
      if (!form.businessName.trim()) {
        nextErrors.businessName =
          "Business name is required.";
      }
  
      if (!form.mobile.trim()) {
        nextErrors.mobile =
          "Mobile number is required.";
      } else if (
        !/^[+]?[\d\s-]{10,15}$/.test(
          form.mobile,
        )
      ) {
        nextErrors.mobile =
          "Enter a valid mobile number.";
      }
  
      if (!form.email.trim()) {
        nextErrors.email =
          "Email address is required.";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email,
        )
      ) {
        nextErrors.email =
          "Enter a valid email address.";
      }
  
      if (!form.address.trim()) {
        nextErrors.address =
          "Address is required.";
      }
  
      setErrors(nextErrors);
  
      return Object.keys(nextErrors).length === 0;
    };
  
    const handleSubmit = async (
      event: React.FormEvent,
    ) => {
      event.preventDefault();
  
      if (!validate()) {
        return;
      }
  
      setLoading(true);
  
      // Temporary frontend delay.
      // Later this becomes an API request.
      await new Promise((resolve) =>
        setTimeout(resolve, 500),
      );
  
      onSubmit({
        customerName:
          form.customerName.trim(),
        businessName:
          form.businessName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        gstNumber:
          form.gstNumber.trim() || undefined,
        customerType:
          form.customerType,
        status: form.status,
        address:
          form.address.trim(),
        followUpDate:
          form.followUpDate || undefined,
        notes:
          form.notes.trim() || undefined,
      });
  
      setLoading(false);
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Contact */}
  
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Contact Information
          </h3>
  
          <p className="mt-1 text-xs text-slate-500">
            Basic contact details of the customer.
          </p>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="customerName"
            label="Customer Name"
            placeholder="e.g. Rahul Sharma"
            value={form.customerName}
            onChange={(event) =>
              updateField(
                "customerName",
                event.target.value,
              )
            }
            error={errors.customerName}
            required
          />
  
          <FormField
            id="businessName"
            label="Business Name"
            placeholder="e.g. Rahul Traders"
            value={form.businessName}
            onChange={(event) =>
              updateField(
                "businessName",
                event.target.value,
              )
            }
            error={errors.businessName}
            required
          />
  
          <FormField
            id="mobile"
            label="Mobile Number"
            placeholder="+91 98765 43210"
            value={form.mobile}
            onChange={(event) =>
              updateField(
                "mobile",
                event.target.value,
              )
            }
            error={errors.mobile}
            required
          />
  
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="customer@company.com"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value,
              )
            }
            error={errors.email}
            required
          />
        </div>
  
        {/* Business */}
  
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Business Information
          </h3>
  
          <p className="mt-1 text-xs text-slate-500">
            Classification and tax information.
          </p>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="gstNumber"
            label="GST Number"
            placeholder="Optional"
            value={form.gstNumber}
            onChange={(event) =>
              updateField(
                "gstNumber",
                event.target.value,
              )
            }
          />
  
          <SelectField
            id="customerType"
            label="Customer Type"
            value={form.customerType}
            onChange={(event) =>
              updateField(
                "customerType",
                event.target.value,
              )
            }
            options={[
              {
                label: "Retail",
                value: "RETAIL",
              },
              {
                label: "Wholesale",
                value: "WHOLESALE",
              },
              {
                label: "Distributor",
                value: "DISTRIBUTOR",
              },
            ]}
            required
          />
  
          <SelectField
            id="status"
            label="Status"
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value,
              )
            }
            options={[
              {
                label: "Lead",
                value: "LEAD",
              },
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Inactive",
                value: "INACTIVE",
              },
            ]}
            required
          />
  
          <FormField
            id="followUpDate"
            label="Follow-up Date"
            type="date"
            value={form.followUpDate}
            onChange={(event) =>
              updateField(
                "followUpDate",
                event.target.value,
              )
            }
          />
        </div>
  
        {/* Address */}
  
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Address & Notes
          </h3>
        </div>
  
        <TextAreaField
          id="address"
          label="Address"
          placeholder="Enter complete business address"
          value={form.address}
          onChange={(event) =>
            updateField(
              "address",
              event.target.value,
            )
          }
          required
        />
  
        <TextAreaField
          id="notes"
          label="Notes"
          placeholder="Add any important customer notes..."
          value={form.notes}
          onChange={(event) =>
            updateField(
              "notes",
              event.target.value,
            )
          }
        />
  
        {/* Actions */}
  
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
  
          <Button
            type="submit"
            loading={loading}
          >
            {isEditing
              ? "Save Changes"
              : "Create Customer"}
          </Button>
        </div>
      </form>
    );
  }