import { ImageResponse } from "next/og";
import { getProduct, getArticle } from "@/lib/content";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{
    locale: string;
    product: string;
    category: string;
    article: string;
  }>;
}

export default async function Image({ params }: OGImageProps) {
  const { locale, product: productSlug, category: categorySlug, article: articleSlug } = await params;
  const product = getProduct(productSlug);
  const article = getArticle(locale, productSlug, categorySlug, articleSlug);

  const title = article ? article.title : "ConnectPi Support Guide";
  const productName = product ? product.name : "ConnectPi";
  const accentColor = product ? product.accent : "#5B2FC9";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF8FF",
          padding: "70px 80px",
          fontFamily: "system-ui, sans-serif",
          borderTop: `16px solid ${accentColor}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: accentColor,
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product?.initial || "π"}
          </div>
          <span style={{ fontSize: 24, fontWeight: "bold", color: "#1B1530" }}>
            {productName} Help Center
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#1B1530",
              lineHeight: 1.2,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          {article && (
            <div style={{ fontSize: 24, color: "#5E5878", maxWidth: 960 }}>
              {article.summary}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#5E5878",
            borderTop: "2px solid #E6E0F5",
            paddingTop: 24,
          }}
        >
          <span>support.connectpi.in</span>
          <span>Official Knowledge Base</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
