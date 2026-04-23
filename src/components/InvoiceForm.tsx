import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Invoice, InvoiceFormData, InvoiceItem, InvoiceStatus } from '../types/invoice';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave: (data: InvoiceFormData, status: InvoiceStatus) => void;
  onDiscard: () => void;
  isEdit?: boolean;
}

const emptyAddress = { street: '', city: '', postCode: '', country: '' };

const emptyItem = (): InvoiceItem => ({
  id: uuidv4(),
  name: '',
  quantity: 1,
  price: 0,
  total: 0,
});

interface FormErrors {
  description?: string;
  clientName?: string;
  clientEmail?: string;
  'senderAddress.street'?: string;
  'senderAddress.city'?: string;
  'senderAddress.postCode'?: string;
  'senderAddress.country'?: string;
  'clientAddress.street'?: string;
  'clientAddress.city'?: string;
  'clientAddress.postCode'?: string;
  'clientAddress.country'?: string;
  items?: string;
  [key: string]: string | undefined;
}

export const InvoiceForm = ({ invoice, onSave, onDiscard, isEdit = false }: InvoiceFormProps) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    description: invoice?.description ?? '',
    paymentTerms: invoice?.paymentTerms ?? 30,
    clientName: invoice?.clientName ?? '',
    clientEmail: invoice?.clientEmail ?? '',
    createdAt: invoice?.createdAt ?? format(new Date(), 'yyyy-MM-dd'),
    senderAddress: invoice?.senderAddress ?? { ...emptyAddress },
    clientAddress: invoice?.clientAddress ?? { ...emptyAddress },
    items: invoice?.items ?? [emptyItem()],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (submitted) validate();
  }, [formData, submitted]);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.clientName.trim()) errs.clientName = "can't be empty";
    if (!formData.clientEmail.trim()) {
      errs.clientEmail = "can't be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errs.clientEmail = 'invalid email';
    }
    if (!formData.description.trim()) errs.description = "can't be empty";
    if (!formData.senderAddress.street.trim()) errs['senderAddress.street'] = "can't be empty";
    if (!formData.senderAddress.city.trim()) errs['senderAddress.city'] = "can't be empty";
    if (!formData.senderAddress.postCode.trim()) errs['senderAddress.postCode'] = "can't be empty";
    if (!formData.senderAddress.country.trim()) errs['senderAddress.country'] = "can't be empty";
    if (!formData.clientAddress.street.trim()) errs['clientAddress.street'] = "can't be empty";
    if (!formData.clientAddress.city.trim()) errs['clientAddress.city'] = "can't be empty";
    if (!formData.clientAddress.postCode.trim()) errs['clientAddress.postCode'] = "can't be empty";
    if (!formData.clientAddress.country.trim()) errs['clientAddress.country'] = "can't be empty";

    if (formData.items.length === 0) {
      errs.items = 'An item must be added';
    } else {
      formData.items.forEach((item, i) => {
        if (!item.name.trim()) errs[`item.${i}.name`] = "can't be empty";
        if (item.quantity <= 0) errs[`item.${i}.quantity`] = 'must be > 0';
        if (item.price < 0) errs[`item.${i}.price`] = 'must be >= 0';
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (status: InvoiceStatus) => {
    setSubmitted(true);
    if (status !== 'draft' && !validate()) return;
    onSave(formData, status);
  };

  const updateField = (field: keyof InvoiceFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddress = (type: 'senderAddress' | 'clientAddress', field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData((prev) => {
      const items = [...prev.items];
      const item = { ...items[index], [field]: value };
      item.total = item.quantity * item.price;
      items[index] = item;
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const fieldClass = (error?: string) =>
    `form-input ${error ? 'error' : ''}`;

  const labelClass = (error?: string) =>
    `form-label ${error ? 'text-[#EC5757]' : ''}`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 md:px-14 pt-8 pb-4">
        <h2 className="text-[24px] font-bold tracking-[-0.5px] text-[var(--text-primary)] mb-10">
          {isEdit ? (
            <>Edit <span className="text-[var(--text-muted)]">#</span>{invoice?.id}</>
          ) : (
            'New Invoice'
          )}
        </h2>

        {/* Bill From */}
        <fieldset className="mb-10">
          <legend className="text-[12px] font-bold text-[#7C5DFA] tracking-[-0.25px] mb-6">
            Bill From
          </legend>
          <div className="grid gap-6">
            <div>
              <div className="flex justify-between">
                <label className={labelClass(errors['senderAddress.street'])} htmlFor="sender-street">Street Address</label>
                {errors['senderAddress.street'] && <span className="text-[#EC5757] text-[10px]">{errors['senderAddress.street']}</span>}
              </div>
              <input
                id="sender-street"
                className={fieldClass(errors['senderAddress.street'])}
                value={formData.senderAddress.street}
                onChange={(e) => updateAddress('senderAddress', 'street', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between">
                  <label className={labelClass(errors['senderAddress.city'])} htmlFor="sender-city">City</label>
                  {errors['senderAddress.city'] && <span className="text-[#EC5757] text-[10px]">{errors['senderAddress.city']}</span>}
                </div>
                <input
                  id="sender-city"
                  className={fieldClass(errors['senderAddress.city'])}
                  value={formData.senderAddress.city}
                  onChange={(e) => updateAddress('senderAddress', 'city', e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className={labelClass(errors['senderAddress.postCode'])} htmlFor="sender-postcode">Post Code</label>
                  {errors['senderAddress.postCode'] && <span className="text-[#EC5757] text-[10px]">{errors['senderAddress.postCode']}</span>}
                </div>
                <input
                  id="sender-postcode"
                  className={fieldClass(errors['senderAddress.postCode'])}
                  value={formData.senderAddress.postCode}
                  onChange={(e) => updateAddress('senderAddress', 'postCode', e.target.value)}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between">
                  <label className={labelClass(errors['senderAddress.country'])} htmlFor="sender-country">Country</label>
                  {errors['senderAddress.country'] && <span className="text-[#EC5757] text-[10px]">{errors['senderAddress.country']}</span>}
                </div>
                <input
                  id="sender-country"
                  className={fieldClass(errors['senderAddress.country'])}
                  value={formData.senderAddress.country}
                  onChange={(e) => updateAddress('senderAddress', 'country', e.target.value)}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Bill To */}
        <fieldset className="mb-10">
          <legend className="text-[12px] font-bold text-[#7C5DFA] tracking-[-0.25px] mb-6">
            Bill To
          </legend>
          <div className="grid gap-6">
            <div>
              <div className="flex justify-between">
                <label className={labelClass(errors.clientName)} htmlFor="client-name">Client's Name</label>
                {errors.clientName && <span className="text-[#EC5757] text-[10px]">{errors.clientName}</span>}
              </div>
              <input
                id="client-name"
                className={fieldClass(errors.clientName)}
                value={formData.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label className={labelClass(errors.clientEmail)} htmlFor="client-email">Client's Email</label>
                {errors.clientEmail && <span className="text-[#EC5757] text-[10px]">{errors.clientEmail}</span>}
              </div>
              <input
                id="client-email"
                type="email"
                placeholder="e.g. email@example.com"
                className={fieldClass(errors.clientEmail)}
                value={formData.clientEmail}
                onChange={(e) => updateField('clientEmail', e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label className={labelClass(errors['clientAddress.street'])} htmlFor="client-street">Street Address</label>
                {errors['clientAddress.street'] && <span className="text-[#EC5757] text-[10px]">{errors['clientAddress.street']}</span>}
              </div>
              <input
                id="client-street"
                className={fieldClass(errors['clientAddress.street'])}
                value={formData.clientAddress.street}
                onChange={(e) => updateAddress('clientAddress', 'street', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between">
                  <label className={labelClass(errors['clientAddress.city'])} htmlFor="client-city">City</label>
                  {errors['clientAddress.city'] && <span className="text-[#EC5757] text-[10px]">{errors['clientAddress.city']}</span>}
                </div>
                <input
                  id="client-city"
                  className={fieldClass(errors['clientAddress.city'])}
                  value={formData.clientAddress.city}
                  onChange={(e) => updateAddress('clientAddress', 'city', e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className={labelClass(errors['clientAddress.postCode'])} htmlFor="client-postcode">Post Code</label>
                  {errors['clientAddress.postCode'] && <span className="text-[#EC5757] text-[10px]">{errors['clientAddress.postCode']}</span>}
                </div>
                <input
                  id="client-postcode"
                  className={fieldClass(errors['clientAddress.postCode'])}
                  value={formData.clientAddress.postCode}
                  onChange={(e) => updateAddress('clientAddress', 'postCode', e.target.value)}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between">
                  <label className={labelClass(errors['clientAddress.country'])} htmlFor="client-country">Country</label>
                  {errors['clientAddress.country'] && <span className="text-[#EC5757] text-[10px]">{errors['clientAddress.country']}</span>}
                </div>
                <input
                  id="client-country"
                  className={fieldClass(errors['clientAddress.country'])}
                  value={formData.clientAddress.country}
                  onChange={(e) => updateAddress('clientAddress', 'country', e.target.value)}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Invoice Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="form-label" htmlFor="invoice-date">Invoice Date</label>
            <input
              id="invoice-date"
              type="date"
              className="form-input"
              value={formData.createdAt}
              onChange={(e) => updateField('createdAt', e.target.value)}
              disabled={isEdit}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="payment-terms">Payment Terms</label>
            <select
              id="payment-terms"
              className="form-input cursor-pointer"
              value={formData.paymentTerms}
              onChange={(e) => updateField('paymentTerms', Number(e.target.value))}
            >
              <option value={1}>Net 1 Day</option>
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between">
              <label className={labelClass(errors.description)} htmlFor="description">Project Description</label>
              {errors.description && <span className="text-[#EC5757] text-[10px]">{errors.description}</span>}
            </div>
            <input
              id="description"
              placeholder="e.g. Graphic Design Service"
              className={fieldClass(errors.description)}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        </div>

        {/* Item List */}
        <div>
          <h3 className="text-[18px] font-bold text-[#777F98] mb-6">Item List</h3>
          <div className="hidden md:grid grid-cols-[1fr_64px_96px_80px_16px] gap-4 mb-4">
            <span className="form-label">Item Name</span>
            <span className="form-label">Qty.</span>
            <span className="form-label">Price</span>
            <span className="form-label">Total</span>
            <span />
          </div>

          <div className="flex flex-col gap-4 mb-4">
            {formData.items.map((item, i) => (
              <div key={item.id} className="grid md:grid-cols-[1fr_64px_96px_80px_16px] gap-4 items-center">
                {/* Mobile labels */}
                <div className="md:hidden">
                  <label className={labelClass(errors[`item.${i}.name`])} htmlFor={`item-name-${i}`}>Item Name</label>
                  <input
                    id={`item-name-${i}`}
                    className={fieldClass(errors[`item.${i}.name`])}
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                  />
                </div>
                {/* Desktop name */}
                <input
                  id={`item-name-${i}`}
                  aria-label="Item Name"
                  className={`hidden md:block ${fieldClass(errors[`item.${i}.name`])}`}
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                />

                <div className="grid grid-cols-[64px_1fr_80px_16px] md:contents gap-4 items-center">
                  <div>
                    <label className={`md:hidden ${labelClass(errors[`item.${i}.quantity`])}`} htmlFor={`item-qty-${i}`}>Qty.</label>
                    <input
                      id={`item-qty-${i}`}
                      type="number"
                      min={1}
                      aria-label="Quantity"
                      className={fieldClass(errors[`item.${i}.quantity`])}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={`md:hidden ${labelClass(errors[`item.${i}.price`])}`} htmlFor={`item-price-${i}`}>Price</label>
                    <input
                      id={`item-price-${i}`}
                      type="number"
                      min={0}
                      step="0.01"
                      aria-label="Price"
                      className={fieldClass(errors[`item.${i}.price`])}
                      value={item.price}
                      onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <span className="md:hidden form-label block mb-2">Total</span>
                    <span className="text-[12px] font-bold text-[var(--text-muted)] flex items-center h-[48px]">
                      {item.total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${item.name || i + 1}`}
                    className="flex items-center justify-center mt-auto mb-[12px] hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16">
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.528 0h3.945z"
                        fill="#888EB0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="text-[#EC5757] text-[10px] mb-4">{errors.items}</p>
          )}

          <button
            type="button"
            onClick={addItem}
            className="w-full py-4 rounded-full bg-[var(--btn-add-item-bg)] text-[var(--btn-add-item-text)] text-[12px] font-bold tracking-[-0.25px] hover:bg-[var(--btn-add-item-hover)] transition-colors cursor-pointer"
          >
            + Add New Item
          </button>
        </div>

        {/* Error summary */}
        {submitted && Object.keys(errors).length > 0 && (
          <div className="mt-8" ref={(el) => { firstErrorRef.current = el; }} tabIndex={-1}>
            <p className="text-[#EC5757] text-[10px] font-semibold">- All fields must be added</p>
            {errors.items && <p className="text-[#EC5757] text-[10px] font-semibold">- {errors.items}</p>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 px-6 md:px-14 py-8 bg-[var(--form-footer-bg)] shadow-[0_-8px_20px_rgba(0,0,0,0.1)]">
        {isEdit ? (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onDiscard} className="btn btn-secondary cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={() => handleSave('pending')} className="btn btn-primary cursor-pointer">
              Save Changes
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-between md:justify-end">
            <button type="button" onClick={onDiscard} className="btn btn-secondary cursor-pointer">
              Discard
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleSave('draft')} className="btn btn-draft cursor-pointer">
                Save as Draft
              </button>
              <button type="button" onClick={() => handleSave('pending')} className="btn btn-primary cursor-pointer">
                Save &amp; Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
