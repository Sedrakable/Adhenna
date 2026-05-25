// Adhenna - src/components/reuse/Form/CartForm/CartForm.tsx
"use client";
import React, { useState, useEffect, FC, ReactNode } from "react";

import styles from "../Form.module.scss";
import { Input, TextArea } from "@/components/reuse/Form/Input/Input";
import { OptionType, Select } from "../Select";
import { State, City } from "country-state-city";
import FlexDiv from "../../FlexDiv";
import { getTranslations } from "@/helpers/langUtils";
import { useLocale } from "next-intl";
import { LangType } from "@/i18n/request";
import {
  AddressFormData,
  FormErrorData,
  getBotDetectionReason,
} from "../formTypes";
import {
  FormSteps,
  FormSubmitButton,
  FormSubmitMessage,
  FormTitles,
  MultiColumn,
} from "../Form";
import { CartProps } from "@/components/pages/blocks/Cart/Cart";
import { ICartProduct, IDeliveryMethod } from "@/data.d";
import { useFormSubmission } from "../useFormSubmission";
import {
  hasFormErrors,
  validateEmailField,
  validateRequiredFields,
} from "../formValidation";

export interface CartFormProps extends CartProps {
  cart: ICartProduct[];
  onDeliveryPriceChange: (price: number) => void; // Add this line
}

export const CartForm: FC<CartFormProps> = ({
  cart,
  deliveryMethods,
  title,
  subTitle,
  onDeliveryPriceChange,
}) => {
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  const defaultCountry = "CA";
  const defaultState = "QC";
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    country: defaultCountry,
    state: defaultState,
    city: "Montréal",
    delivery: "",
    message: "",
    company: "", // Honeypot field
  });

  const [errors, setErrors] = useState<FormErrorData>({});
  const { loading, submitted, submitForm, submitText } =
    useFormSubmission(translations);

  const methodToString = (method: IDeliveryMethod) => {
    return `${method.method}${
      method.price && method.price > 0 ? ` (${method.price} $)` : ""
    }`;
  };
  const deliveryOptions: OptionType[] = deliveryMethods.map(
    (method: IDeliveryMethod) => ({
      value: methodToString(method),
      label: methodToString(method),
    }),
  );
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    setStates(
      State.getStatesOfCountry(defaultCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
    );
    setCities(
      City.getCitiesOfState(formData.country, defaultState).map((city) => ({
        value: city.name,
        label: city.name,
      })),
    );
  }, []);

  const handleStateChange = (selected: string) => {
    const stateCode = selected;
    setFormData((prev) => ({ ...prev, state: stateCode } as AddressFormData));
    setCities(
      City.getCitiesOfState(formData.country, stateCode).map((city) => ({
        value: city.name,
        label: city.name,
      })),
    );
  };

  const handleCityChange = (selected: string) => {
    const cityCode = selected;
    setFormData((prev) => ({ ...prev, city: cityCode } as AddressFormData));
  };

  const handleInputChange = (field: keyof AddressFormData) => (
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    }
  };

  const handleDeliveryChange = (selected: string) => {
    const price =
      deliveryMethods.find((method) => methodToString(method) === selected)
        ?.price || 0;
    setDeliveryPrice(price);
    onDeliveryPriceChange(price); // Notify parent of new price

    setFormData((prev) => ({ ...prev, delivery: selected }));
    if (errors.delivery) {
      setErrors((prev) => ({ ...prev, delivery: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const botReason = getBotDetectionReason(formData);
    if (botReason) {
      console.error("Blocked spam-ish submission:", botReason);
      return;
    }

    await submitForm({
      endpoint: "/api/sendCartFormEmail",
      body: { formData, cart, deliveryPrice, locale },
    });
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof AddressFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "addressLine1",
      "postalCode",
      "country",
      "state",
      "city",
      "delivery",
    ];

    const newErrors = validateEmailField(
      validateRequiredFields(formData, requiredFields),
      formData.email,
    );
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  };

  const Steps: ReactNode[] = [
    <Input
      label="Form check"
      type="text"
      value={formData.company || ""}
      onChange={handleInputChange("company")}
      placeholder=""
      honeyPot
    />,
    <MultiColumn>
      <Input
        label={translations.form.general.firstName}
        type="text"
        value={formData.firstName}
        onChange={handleInputChange("firstName")}
        required
        isInvalid={errors.firstName}
        placeholder={translations.form.general.firstNamePlaceholder}
      />
      <Input
        label={translations.form.general.lastName}
        type="text"
        value={formData.lastName}
        onChange={handleInputChange("lastName")}
        required
        isInvalid={errors.lastName}
        placeholder={translations.form.general.lastNamePlaceholder}
      />
    </MultiColumn>,
    <Input
      label={translations.form.general.email}
      type="email"
      value={formData.email}
      onChange={handleInputChange("email")}
      required
      isInvalid={errors.email}
      placeholder={translations.form.general.emailPlaceholder}
    />,
    <>
      {" "}
      <MultiColumn>
        <Select
          label={translations.form.cart.province}
          options={states}
          onChange={handleStateChange}
          defaultValue={formData.state}
        />
        <Select
          label={translations.form.cart.city}
          disabled={cities.length === 0}
          options={cities}
          onChange={handleCityChange}
          defaultValue={formData.city}
          placeholder={translations.form.cart.city}
        />
        <Input
          label={translations.form.cart.postalCode}
          type="text"
          value={formData.postalCode}
          onChange={handleInputChange("postalCode")}
          required
          isInvalid={errors.postalCode}
          placeholder={translations.form.cart.postalCodePlaceholder}
        />
      </MultiColumn>
      <Input
        label={translations.form.cart.addressLine + " 1"}
        type="text"
        value={formData.addressLine1}
        required
        isInvalid={errors.addressLine1}
        onChange={handleInputChange("addressLine1")}
      />
      <Input
        label={translations.form.cart.addressLine + " 2"}
        type="text"
        value={formData.addressLine2}
        onChange={handleInputChange("addressLine2")}
      />
    </>,
    <Select
      label={translations.form.cart.delivery}
      options={deliveryOptions}
      onChange={handleDeliveryChange}
      required
      isInvalid={errors.delivery}
    />,
    <TextArea
      label={translations.form.general.additionalInfo}
      value={formData.message}
      onChange={handleInputChange("message")}
    />,
  ];

  return (
    <FlexDiv width100>
      {submitted ? (
        <FormSubmitMessage locale={locale} translations={translations} />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormTitles title={title} subTitle={subTitle} alignText="left" />
          <FormSteps steps={Steps} />
          <FormSubmitButton
            submitText={submitText}
            isValid={!hasFormErrors(errors)}
            translations={translations}
            loading={loading}
          />
        </form>
      )}
    </FlexDiv>
  );
};
