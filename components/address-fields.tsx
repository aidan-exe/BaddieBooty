import type { ReactNode } from "react";
import { provinces, type AddressDraft, type BillingDraft } from "@/lib/checkout-details";

const control =
  "min-h-11 w-full rounded-xl border bg-white px-3 text-base font-normal text-ink outline-none ring-brand/30 placeholder:text-muted/70 focus:ring-2";

function fieldId(prefix: string, name: string) {
  return `field-${prefix}-${name}`;
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <label className="block space-y-1.5 text-sm font-medium" htmlFor={id}>
      <span>
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </span>
      {children}
      {error ? (
        <span id={errorId} role="alert" className="block text-xs font-normal text-red-800">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function AddressFields({
  prefix,
  value,
  errors,
  onChange,
  onBlur,
  includeEmail,
}: {
  prefix: "billing" | "shipping";
  value: AddressDraft | BillingDraft;
  errors: Record<string, string | undefined>;
  onChange: (field: string, next: string) => void;
  onBlur: (field: string) => void;
  includeEmail?: boolean;
}) {
  const email = "email" in value ? value.email : "";
  const invalid = (name: string) => Boolean(errors[`${prefix}.${name}`]);
  const described = (name: string) =>
    invalid(name) ? { "aria-invalid": true as const, "aria-describedby": `${fieldId(prefix, name)}-error` } : {};

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field id={fieldId(prefix, "firstName")} label="First name" error={errors[`${prefix}.firstName`]}>
        <input
          id={fieldId(prefix, "firstName")}
          value={value.firstName}
          autoComplete={`${prefix} given-name`}
          onChange={(event) => onChange("firstName", event.target.value)}
          onBlur={() => onBlur("firstName")}
          className={`${control} ${invalid("firstName") ? "border-red-700" : "border-ink/10"}`}
          {...described("firstName")}
        />
      </Field>
      <Field id={fieldId(prefix, "lastName")} label="Last name" error={errors[`${prefix}.lastName`]}>
        <input
          id={fieldId(prefix, "lastName")}
          value={value.lastName}
          autoComplete={`${prefix} family-name`}
          onChange={(event) => onChange("lastName", event.target.value)}
          onBlur={() => onBlur("lastName")}
          className={`${control} ${invalid("lastName") ? "border-red-700" : "border-ink/10"}`}
          {...described("lastName")}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field
          id={fieldId(prefix, "company")}
          label="Company name"
          optional
          error={errors[`${prefix}.company`]}
        >
          <input
            id={fieldId(prefix, "company")}
            value={value.company}
            autoComplete={`${prefix} organization`}
            onChange={(event) => onChange("company", event.target.value)}
            onBlur={() => onBlur("company")}
            className={`${control} ${invalid("company") ? "border-red-700" : "border-ink/10"}`}
            {...described("company")}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id={fieldId(prefix, "country")} label="Country / Region">
          <input
            id={fieldId(prefix, "country")}
            value="South Africa"
            readOnly
            autoComplete={`${prefix} country`}
            className={`${control} border-ink/10 bg-cream text-ink`}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id={fieldId(prefix, "address1")} label="Street address" error={errors[`${prefix}.address1`]}>
          <input
            id={fieldId(prefix, "address1")}
            value={value.address1}
            placeholder="House number and street name"
            autoComplete={`${prefix} address-line1`}
            onChange={(event) => onChange("address1", event.target.value)}
            onBlur={() => onBlur("address1")}
            className={`${control} ${invalid("address1") ? "border-red-700" : "border-ink/10"}`}
            {...described("address1")}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field
          id={fieldId(prefix, "address2")}
          label="Apartment, suite, unit, etc."
          optional
          error={errors[`${prefix}.address2`]}
        >
          <input
            id={fieldId(prefix, "address2")}
            value={value.address2}
            placeholder="Apartment, suite, unit, etc. (optional)"
            autoComplete={`${prefix} address-line2`}
            onChange={(event) => onChange("address2", event.target.value)}
            onBlur={() => onBlur("address2")}
            className={`${control} ${invalid("address2") ? "border-red-700" : "border-ink/10"}`}
            {...described("address2")}
          />
        </Field>
      </div>
      <Field id={fieldId(prefix, "city")} label="Town / City" error={errors[`${prefix}.city`]}>
        <input
          id={fieldId(prefix, "city")}
          value={value.city}
          autoComplete={`${prefix} address-level2`}
          onChange={(event) => onChange("city", event.target.value)}
          onBlur={() => onBlur("city")}
          className={`${control} ${invalid("city") ? "border-red-700" : "border-ink/10"}`}
          {...described("city")}
        />
      </Field>
      <Field id={fieldId(prefix, "province")} label="Province" error={errors[`${prefix}.province`]}>
        <select
          id={fieldId(prefix, "province")}
          value={value.province}
          autoComplete={`${prefix} address-level1`}
          onChange={(event) => onChange("province", event.target.value)}
          onBlur={() => onBlur("province")}
          className={`${control} ${invalid("province") ? "border-red-700" : "border-ink/10"}`}
          {...described("province")}
        >
          <option value="">Select a province</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id={fieldId(prefix, "postcode")} label="Postcode / ZIP" error={errors[`${prefix}.postcode`]}>
        <input
          id={fieldId(prefix, "postcode")}
          value={value.postcode}
          inputMode="numeric"
          autoComplete={`${prefix} postal-code`}
          maxLength={8}
          onChange={(event) => onChange("postcode", event.target.value)}
          onBlur={() => onBlur("postcode")}
          className={`${control} ${invalid("postcode") ? "border-red-700" : "border-ink/10"}`}
          {...described("postcode")}
        />
      </Field>
      <Field id={fieldId(prefix, "phone")} label="Phone" error={errors[`${prefix}.phone`]}>
        <input
          id={fieldId(prefix, "phone")}
          type="tel"
          value={value.phone}
          inputMode="tel"
          autoComplete={`${prefix} tel`}
          placeholder="082 123 4567"
          onChange={(event) => onChange("phone", event.target.value)}
          onBlur={() => onBlur("phone")}
          className={`${control} ${invalid("phone") ? "border-red-700" : "border-ink/10"}`}
          {...described("phone")}
        />
      </Field>
      {includeEmail ? (
        <div className="sm:col-span-2">
          <Field id={fieldId(prefix, "email")} label="Email address" error={errors[`${prefix}.email`]}>
            <input
              id={fieldId(prefix, "email")}
              type="email"
              value={email}
              autoComplete="email"
              inputMode="email"
              onChange={(event) => onChange("email", event.target.value)}
              onBlur={() => onBlur("email")}
              className={`${control} ${invalid("email") ? "border-red-700" : "border-ink/10"}`}
              {...described("email")}
            />
          </Field>
        </div>
      ) : null}
    </div>
  );
}
