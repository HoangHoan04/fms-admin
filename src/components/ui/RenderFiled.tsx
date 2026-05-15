import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import dayjs from "dayjs";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { TabPanel, TabView } from "primereact/tabview";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { FormField } from "./FormCustom";
import { FileUploadCustom } from ".";

const isDeepEqual = (a: any, b: any) => {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

const RequiredLabel = memo(({ label, required }: { label: string; required?: boolean }) => (
  <label className="mb-2 block font-medium">
    {label}
    {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
  </label>
));

const CustomCalendar = memo(({ field, value, onChange, commonProps }: any) => {
  const { showToast } = useToast();
  const lastToastRef = useRef<string>("");
  const calendarRef = useRef<any>(null);

  const handleRealtimeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const inputType = (e as any).nativeEvent?.inputType;
    if (inputType?.includes("delete") || inputType?.includes("remove")) {
      return;
    }

    const val = target.value;
    const digits = val.replace(/\D/g, "");

    let formatted = "";

    if (digits.length >= 2) {
      const dayStr = digits.substring(0, 2);
      const dayNum = parseInt(dayStr, 10);

      if (dayNum > 31 || dayNum === 0) {
        if (lastToastRef.current !== "day") {
          showToast({
            type: "error",
            title: "Ngày không hợp lệ",
            message: "Ngày phải nằm trong khoảng từ 01 đến 31",
          });
          lastToastRef.current = "day";
          setTimeout(() => (lastToastRef.current = ""), 2000);
        }
        formatted = digits.substring(0, 1);
        target.value = formatted;
        return;
      }

      formatted += dayStr;
      if (digits.length > 2) {
        formatted += "/";
      }
    } else {
      formatted = digits;
    }

    if (digits.length >= 4) {
      const monthStr = digits.substring(2, 4);
      const monthNum = parseInt(monthStr, 10);

      if (monthNum > 12 || monthNum === 0) {
        if (lastToastRef.current !== "month") {
          showToast({
            type: "error",
            title: "Tháng không hợp lệ",
            message: "Tháng phải nằm trong khoảng từ 01 đến 12",
          });
          lastToastRef.current = "month";
          setTimeout(() => (lastToastRef.current = ""), 2000);
        }
        formatted = formatted.substring(0, 3) + digits.substring(2, 3);
        target.value = formatted;
        return;
      }

      formatted += monthStr;
      if (digits.length > 4) {
        formatted += "/";
      }
    } else if (digits.length > 2) {
      formatted += digits.substring(2);
    }

    if (digits.length >= 5) {
      const yearStr = digits.substring(4, 8);
      formatted += yearStr;

      if (yearStr.length === 4) {
        const yearNum = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();

        if (yearNum > currentYear || yearNum < 1900) {
          if (lastToastRef.current !== "year") {
            showToast({
              type: "error",
              title: "Năm không hợp lệ",
              message: `Năm không được lớn hơn năm hiện tại (${currentYear})`,
            });
            lastToastRef.current = "year";
            setTimeout(() => (lastToastRef.current = ""), 2000);
          }
          formatted = formatted.substring(0, 6) + yearStr.substring(0, 3);
          target.value = formatted;
          return;
        }

        const dayStr = digits.substring(0, 2);
        const monthStr = digits.substring(2, 4);
        const parsedObj = dayjs(`${yearStr}-${monthStr}-${dayStr}`);
        if (parsedObj.isValid()) {
          onChange(field.name, parsedObj.toDate());
          setTimeout(() => {
            calendarRef.current?.show?.();
          }, 10);
        }
      }
    }

    target.value = formatted;
  };

  const handleInputBlur = (e: any) => {
    const rawValue = e.target?.value;
    if (!rawValue) return;

    const digits = rawValue.replace(/\D/g, "");

    if (digits.length === 8) {
      const d = digits.substring(0, 2);
      const m = digits.substring(2, 4);
      const y = digits.substring(4, 8);

      const parsed = dayjs(`${y}-${m}-${d}`);
      if (parsed.isValid()) {
        onChange(field.name, parsed.toDate());
        e.target.value = `${d}/${m}/${y}`;
        return;
      }
    }
  };

  return (
    <div className="relative w-full" style={{ width: "100%" }}>
      <Calendar
        ref={calendarRef}
        value={value ? dayjs(value).toDate() : null}
        onChange={(e) => onChange(field.name, e.value)}
        onInput={handleRealtimeInput}
        onBlur={handleInputBlur}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            handleInputBlur(e);
          }
        }}
        showTime={field.type === "datetimepicker"}
        dateFormat="dd/mm/yy"
        placeholder={field.placeholder || "DD/MM/YYYY"}
        inputStyle={{
          width: "100%",
          paddingRight: "2.5rem",
        }}
        inputClassName="w-full! pr-10! outline-1! outline-gray-300! rounded-md!"
        className="w-full!"
        style={{ width: "100%" }}
        {...commonProps}
      />
      <i className="pi pi-calendar pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-gray-400"></i>
    </div>
  );
});

interface FieldItemProps {
  field: FormField;
  value: any;
  onChange: (key: string, value: any) => void;
  setRef: (name: string, el: any) => void;
  getValues: () => any;
  allValues?: Record<string, any>;
}

const FieldItem = memo(
  ({ field, value, onChange, setRef, getValues, allValues }: FieldItemProps) => {
    const { theme } = useTheme();

    const commonProps = {
      style: { width: "100%", ...(field.inputStyle || {}) },
      disabled: field.disabled,
    };

    const handleSetRef = (el: any) => setRef(field.name, el);

    switch (field.type) {
      case "input":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputText
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );
      case "email":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputText
              value={value || ""}
              placeholder={field.placeholder || "example@email.com"}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );

      case "phoneNumber":
        return (
          <div ref={handleSetRef} className="phone-input-container">
            <RequiredLabel label={field.label} required={field.required} />
            <PhoneInput
              country={"vn"}
              value={value}
              onChange={(phone) => onChange(field.name, phone)}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "6px",
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              buttonStyle={{
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#f8f9fa",
              }}
              dropdownStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              searchStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholder={field.placeholder || "Số điện thoại"}
              disabled={field.disabled}
              enableSearch={true}
            />
          </div>
        );
      case "textarea":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputTextarea
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              rows={4}
              {...commonProps}
            />
          </div>
        );
      case "richtext":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Editor
              value={value || ""}
              onTextChange={(e) => onChange(field.name, e.htmlValue || "")}
              style={{ height: "350px" }}
              placeholder={field.placeholder}
            />
          </div>
        );
      case "number":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputNumber
              value={value}
              onValueChange={(e) => onChange(field.name, e.value)}
              {...commonProps}
            />
          </div>
        );
      case "select":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Dropdown
              value={value}
              options={
                field.options && field.options.length > 0
                  ? field.options.map((o) => ({
                      label: o.name,
                      value: o.value,
                    }))
                  : [{ label: "Không có lựa chọn", value: "" }]
              }
              onChange={(e) => onChange(field.name, e.value)}
              placeholder={field.placeholder ?? "Không có lựa chọn"}
              {...commonProps}
            />
          </div>
        );
      case "multiselect":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <MultiSelect
              value={value || []}
              options={field.options?.map((o) => ({
                label: o.name,
                value: o.value,
              }))}
              onChange={(e) => onChange(field.name, e.value)}
              placeholder={field.placeholder}
              display="chip"
              {...commonProps}
            />
          </div>
        );
      case "datepicker":
      case "datetimepicker":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <CustomCalendar
              field={field}
              value={value}
              onChange={onChange}
              commonProps={commonProps}
            />
          </div>
        );
      case "switch":
        return (
          <div className="flex items-center" ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <div className="ml-2">
              <InputSwitch
                checked={!!value}
                onChange={(e) => onChange(field.name, e.value)}
                {...commonProps}
              />
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex h-full items-center pt-8" ref={handleSetRef}>
            <Checkbox
              inputId={field.name}
              checked={value || false}
              onChange={(e) => onChange(field.name, e.checked)}
            />
            <label htmlFor={field.name} className="ml-2 cursor-pointer select-none">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        );
      case "radioGroup":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <div className="flex flex-wrap gap-3">
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center">
                  <RadioButton
                    inputId={`${field.name}_${opt.value}`}
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => onChange(field.name, e.value)}
                  />
                  <label htmlFor={`${field.name}_${opt.value}`} className="ml-2 cursor-pointer">
                    {opt.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case "file":
      case "image":
        return (
          <div ref={handleSetRef} className="w-full">
            <FileUploadCustom
              label={field.label}
              required={field.required}
              initValue={value}
              onFileUploaded={(uploadedData) => onChange(field.name, uploadedData)}
              type={field.type === "image" ? "image" : field.fileType || "all"}
              mode={field.isSingle ? "single" : "multi"}
              maxSize={field.maxSize || 10}
              disabled={field.disabled}
              className="w-full"
            />
          </div>
        );
      case "action":
        return (
          <div ref={handleSetRef}>
            <Button
              label={field.buttonText || field.label || "Thực hiện"}
              icon="pi pi-check"
              onClick={() => field.onAction?.(getValues())}
            />
          </div>
        );
      case "tab":
        return (
          <div ref={handleSetRef} style={{ gridColumn: "span 24" }}>
            <TabView
              pt={{
                panelContainer: {
                  style: {
                    padding: "12px 0",
                  },
                },
                nav: {
                  style: {
                    padding: "0",
                  },
                },
              }}
            >
              {field.tabFields?.map((tabFields, index) => (
                <TabPanel key={index} header={index === 0 ? "Tiếng Việt" : "Tiếng Anh"}>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                    }}
                  >
                    {tabFields.map((subField) => (
                      <div
                        key={subField.name}
                        style={{
                          gridColumn: subField.gridColumn || `span ${subField.col || 24}`,
                        }}
                      >
                        <FieldItem
                          field={subField}
                          value={allValues?.[subField.name]}
                          onChange={onChange}
                          setRef={setRef}
                          getValues={getValues}
                          allValues={allValues}
                        />
                      </div>
                    ))}
                  </div>
                </TabPanel>
              ))}
            </TabView>
          </div>
        );
      case "custom":
        return field.render ? (
          <div>
            <RequiredLabel label={field.label} required={field.required} />
            {field.render({
              value,
              onChange: (val: any) => onChange(field.name, val),
            })}
          </div>
        ) : null;
      default:
        return null;
    }
  },
  (prev, next) => {
    const valueChanged = prev.value !== next.value;
    const disabledChanged = prev.field.disabled !== next.field.disabled;
    const allValuesChanged = !isDeepEqual(prev.allValues, next.allValues);
    const optionsChanged = !isDeepEqual(prev.field.options, next.field.options);
    const renderChanged = prev.field.render !== next.field.render;
    return !valueChanged && !disabledChanged && !allValuesChanged && !optionsChanged && !renderChanged;
  },
);

function useRenderFormCustom(
  fields: FormField[],
  initialValues: Record<string, any> = {},
  onChangeValue?: (allValues: any) => void,
) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errorField, setErrorField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, any>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (errorField && fieldRefs.current[errorField]) {
      const element = fieldRefs.current[errorField];
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        if (element.focus) {
          element.focus();
        } else if (element.querySelector) {
          const input = element.querySelector("input, textarea, select");
          input?.focus();
        }
      }, 300);
      setErrorField(null);
    }
  }, [errorField]);

  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [key]: value };
        if (onChangeValue) {
          onChangeValue(newValues);
        }
        return newValues;
      });
    },
    [onChangeValue],
  );

  const handleSetRef = useCallback((name: string, el: any) => {
    fieldRefs.current[name] = el;
  }, []);

  const getValues = useCallback(() => ({ ...values }), [values]);

  const setValuesExternal = useCallback(
    (newValues: any) => setValues((prev) => ({ ...prev, ...newValues })),
    [],
  );

  const resetFields = useCallback(() => setValues(initialValues), [initialValues]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const validateFields = useCallback(async () => {
    const allFields: FormField[] = [];
    for (const field of fields) {
      if (field.type === "tab" && field.tabFields) {
        field.tabFields.forEach((tabFieldArray) => {
          allFields.push(...tabFieldArray);
        });
      } else {
        allFields.push(field);
      }
    }

    for (const field of allFields) {
      const val = values[field.name];

      if (
        field.required &&
        (val === undefined ||
          val === "" ||
          val === null ||
          (Array.isArray(val) && val.length === 0))
      ) {
        showToast({
          type: "error",
          title: "Lỗi",
          message: "Trường này là bắt buộc",
        });
        setErrorField(field.name);
        return false;
      }

      if (field.type === "email" && val) {
        if (!validateEmail(val)) {
          showToast({
            type: "error",
            title: "Lỗi",
            message: "Email không hợp lệ",
          });
          setErrorField(field.name);
          return false;
        }
      }

      if (field.type === "phoneNumber" && val) {
        if (val.length < 8) {
          showToast({
            type: "error",
            title: "Lỗi",
            message: "Số điện thoại không hợp lệ",
          });
          setErrorField(field.name);
          return false;
        }
      }
    }
    return true;
  }, [fields, values, showToast]);

  const renderField = useCallback(
    (field: FormField) => {
      return (
        <FieldItem
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={handleChange}
          setRef={handleSetRef}
          getValues={getValues}
          allValues={values}
        />
      );
    },
    [values, handleChange, handleSetRef, getValues],
  );

  return {
    renderField,
    getValues,
    setValues: setValuesExternal,
    resetFields,
    validateFields,
  };
}

export { useRenderFormCustom };
