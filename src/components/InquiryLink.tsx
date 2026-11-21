import { ArrowUpRight, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product, ProductVariant } from "../data/products";
import { buildContactFallback, buildWhatsAppUrl, getWhatsAppNumber } from "../lib/inquiry";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  product?: Product;
  variant?: ProductVariant;
  message?: string;
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export default function InquiryLink({ product, variant, message, className = "btn btn-red", label = "Minta penawaran", showIcon = true }: Props) {
  const { t, language } = useLanguage();
  const input = { product, variant, message, language };
  const whatsapp = buildWhatsAppUrl(input);
  const content = <>{showIcon && <MessageSquareText size={16} aria-hidden="true" />}<span>{t(label)}</span><ArrowUpRight size={16} aria-hidden="true" /></>;
  if (whatsapp) return <a className={className} href={whatsapp} target="_blank" rel="noreferrer" aria-label={t("{label} {target} melalui WhatsApp", { label: t(label), target: product?.name ?? "HCBTECH" })}>{content}</a>;
  return <Link className={className} to={buildContactFallback(input)} aria-label={t("{label} {target} — buka formulir kontak", { label: t(label), target: product?.name ?? "HCBTECH" })} title={!getWhatsAppNumber() ? t("Nomor WhatsApp belum dikonfigurasi; lanjutkan melalui formulir kontak") : undefined}>{content}</Link>;
}
