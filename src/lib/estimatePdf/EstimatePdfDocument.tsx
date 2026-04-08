import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const DARK = "#2D1C22";
const GOLD = "#af9e6d";
const GOLD_BG = "#f9f6ef";
const WHITE = "#ffffff";
const OFF_WHITE = "#faf9f6";
const GRAY = "#888888";
const BORDER = "#e0dcd4";

export type EstimateLineItem = {
  label: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
};

export interface EstimateBreakdown {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
}

export interface EstimateData {
  estimateNumber: string;
  date: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  items: EstimateLineItem[];
  /** Grand total (equals breakdown.grandTotal when breakdown is set). */
  total: number;
  breakdown?: EstimateBreakdown;
}

const s = StyleSheet.create({
  page: {
    backgroundColor: OFF_WHITE,
    paddingHorizontal: 36,
    paddingVertical: 28,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
  },

  accentBar: { height: 3, backgroundColor: GOLD, borderRadius: 1 },

  header: {
    backgroundColor: DARK,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginBottom: 6,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 42,
    height: 42,
    borderWidth: 2,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoLetter: {
    color: GOLD,
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
  },
  brandName: {
    color: WHITE,
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2.5,
  },
  brandGold: { color: GOLD },
  brandSub: {
    color: WHITE,
    fontSize: 7.5,
    letterSpacing: 3,
    marginTop: 3,
    opacity: 0.7,
  },
  headerRight: { alignItems: "flex-end" },
  estLabel: {
    color: GOLD,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    marginBottom: 3,
  },
  estNum: { color: WHITE, fontSize: 13, fontFamily: "Helvetica-Bold" },
  estDate: { color: WHITE, fontSize: 8, marginTop: 3, opacity: 0.7 },

  ascii: {
    fontFamily: "Courier",
    color: GOLD,
    textAlign: "center",
    letterSpacing: 1,
  },

  cardOuter: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardHead: { backgroundColor: GOLD, paddingVertical: 8, paddingHorizontal: 14 },
  cardHeadText: {
    color: WHITE,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
  },
  cardBody: { padding: 14, backgroundColor: WHITE },
  cardRow: { flexDirection: "row", marginBottom: 5 },
  cardLabel: {
    width: 65,
    fontSize: 8,
    color: GRAY,
    fontFamily: "Helvetica-Bold",
  },
  cardValue: { flex: 1, fontSize: 10, color: DARK },

  tableWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  tHead: {
    flexDirection: "row",
    backgroundColor: DARK,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tHeadText: {
    color: GOLD,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  tRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    backgroundColor: WHITE,
  },
  tRowAlt: { backgroundColor: "#fdfcf9" },
  tDesc: { flex: 1, fontSize: 10, color: DARK },
  tQty: { width: 36, fontSize: 9, color: DARK, textAlign: "right" },
  tUnit: { width: 72, fontSize: 9, color: DARK, textAlign: "right" },
  tAmt: {
    width: 80,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },
  tTotal: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: GOLD_BG,
  },
  tTotalLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  tTotalAmt: {
    width: 80,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    textAlign: "right",
  },
  summaryRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#f5f3ee",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  summaryLabel: { flex: 1, fontSize: 9, color: GRAY },
  summaryAmt: {
    width: 80,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },

  notesBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "dashed",
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  notesTitle: {
    color: GOLD,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    marginBottom: 6,
  },
  notesBody: { color: GRAY, fontSize: 9, lineHeight: 1.6 },

  footer: {
    marginTop: "auto",
    backgroundColor: DARK,
    borderRadius: 6,
    padding: 20,
  },
  footerDisclaimer: {
    color: WHITE,
    fontSize: 7.5,
    textAlign: "center",
    opacity: 0.5,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  footerMid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  footerLogoBox: {
    width: 26,
    height: 26,
    borderWidth: 1.5,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  footerLogoLetter: {
    color: GOLD,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  footerCompany: {
    color: WHITE,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  footerDetail: { color: WHITE, fontSize: 7.5, opacity: 0.7, marginBottom: 1 },
  footerThanks: {
    fontFamily: "Courier",
    color: GOLD,
    textAlign: "center",
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 10,
  },
});

function AsciiRule() {
  return (
    <Text style={[s.ascii, { fontSize: 7, opacity: 0.4, marginVertical: 4 }]}>
      {"=".repeat(56)}
    </Text>
  );
}

function AsciiTitle({ title }: { title: string }) {
  return (
    <Text style={[s.ascii, { fontSize: 9, marginVertical: 14 }]}>
      {"=".repeat(10)}
      {"  "}
      {title}
      {"  "}
      {"=".repeat(10)}
    </Text>
  );
}

function AsciiDots() {
  return (
    <Text style={[s.ascii, { fontSize: 7, opacity: 0.3, marginVertical: 8 }]}>
      {"*   ".repeat(13)}*
    </Text>
  );
}

function AsciiHouse() {
  const lines = [
    "      /\\",
    "     /  \\",
    "    /    \\",
    "   /______\\",
    "   |  []  |",
    "   | ____ |",
    "   ||    ||",
  ];
  return (
    <View style={{ alignItems: "center", marginBottom: 8 }}>
      {lines.map((ln, i) => (
        <Text
          key={i}
          style={{
            fontFamily: "Courier",
            fontSize: 6,
            color: GOLD,
            opacity: 0.45,
            lineHeight: 1.2,
          }}
        >
          {ln}
        </Text>
      ))}
    </View>
  );
}

function AsciiCorner() {
  return (
    <Text style={[s.ascii, { fontSize: 7, opacity: 0.25, marginVertical: 2 }]}>
      {".~".repeat(28)}.
    </Text>
  );
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function EstimatePdfDocument({ data }: { data: EstimateData }) {
  const detailed = Boolean(data.breakdown);

  return (
    <Document
      title={`Estimate ${data.estimateNumber}`}
      author="Walker Vision Co."
      subject="Service Estimate"
    >
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} />

        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.logoBox}>
              <Text style={s.logoLetter}>W</Text>
            </View>
            <View>
              <Text style={s.brandName}>
                WALKER <Text style={s.brandGold}>VISION</Text> CO.
              </Text>
              <Text style={s.brandSub}>HOME RENOVATION SPECIALISTS</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={s.estLabel}>ESTIMATE</Text>
            <Text style={s.estNum}>{data.estimateNumber}</Text>
            <Text style={s.estDate}>{data.date}</Text>
          </View>
        </View>

        <AsciiCorner />

        <AsciiTitle title="S E R V I C E   E S T I M A T E" />

        <View style={s.cardOuter}>
          <View style={s.cardHead}>
            <Text style={s.cardHeadText}>PREPARED FOR</Text>
          </View>
          <View style={s.cardBody}>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Name</Text>
              <Text style={s.cardValue}>{data.contact.name}</Text>
            </View>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Email</Text>
              <Text style={s.cardValue}>{data.contact.email}</Text>
            </View>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Phone</Text>
              <Text style={s.cardValue}>{data.contact.phone}</Text>
            </View>
            {data.contact.address ? (
              <View style={s.cardRow}>
                <Text style={s.cardLabel}>Address</Text>
                <Text style={s.cardValue}>{data.contact.address}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <AsciiDots />

        <View style={s.tableWrap}>
          <View style={s.tHead}>
            <Text style={[s.tHeadText, { flex: 1 }]}>DESCRIPTION</Text>
            {detailed ? (
              <>
                <Text style={[s.tHeadText, s.tQty]}>QTY</Text>
                <Text style={[s.tHeadText, s.tUnit]}>UNIT</Text>
              </>
            ) : null}
            <Text style={[s.tHeadText, { width: 80, textAlign: "right" }]}>AMOUNT</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={[s.tRow, i % 2 !== 0 ? s.tRowAlt : {}]}>
              <Text style={s.tDesc}>{item.label}</Text>
              {detailed ? (
                <>
                  <Text style={s.tQty}>{item.quantity ?? "—"}</Text>
                  <Text style={s.tUnit}>
                    {item.unitPrice != null ? money(item.unitPrice) : "—"}
                  </Text>
                </>
              ) : null}
              <Text style={s.tAmt}>{money(item.amount)}</Text>
            </View>
          ))}

          {detailed && data.breakdown ? (
            <>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Subtotal</Text>
                <View style={{ width: 36 }} />
                <View style={{ width: 72 }} />
                <Text style={s.summaryAmt}>{money(data.breakdown.subtotal)}</Text>
              </View>
              {data.breakdown.discountPercent > 0 ? (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>
                    Discount ({data.breakdown.discountPercent}%)
                  </Text>
                  <View style={{ width: 36 }} />
                  <View style={{ width: 72 }} />
                  <Text style={s.summaryAmt}>-{money(data.breakdown.discountAmount)}</Text>
                </View>
              ) : null}
              {data.breakdown.taxPercent > 0 ? (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>
                    Tax ({data.breakdown.taxPercent}%)
                  </Text>
                  <View style={{ width: 36 }} />
                  <View style={{ width: 72 }} />
                  <Text style={s.summaryAmt}>{money(data.breakdown.taxAmount)}</Text>
                </View>
              ) : null}
            </>
          ) : null}

          <View style={s.tTotal}>
            <Text style={s.tTotalLabel}>TOTAL ESTIMATE</Text>
            {detailed ? (
              <>
                <View style={{ width: 36 }} />
                <View style={{ width: 72 }} />
              </>
            ) : null}
            <Text style={s.tTotalAmt}>
              {money(data.breakdown?.grandTotal ?? data.total)}
            </Text>
          </View>
        </View>

        {data.contact.notes ? (
          <View style={s.notesBox}>
            <Text style={s.notesTitle}>ADDITIONAL NOTES</Text>
            <Text style={s.notesBody}>{data.contact.notes}</Text>
          </View>
        ) : null}

        <View style={s.footer} wrap={false}>
          <Text style={s.footerDisclaimer}>
            This estimate is valid for 30 days from the date of issue.
            {"\n"}
            Prices may vary based on final site inspection.
          </Text>

          <AsciiRule />
          <AsciiHouse />

          <View style={s.footerMid}>
            <View style={s.footerLogoBox}>
              <Text style={s.footerLogoLetter}>W</Text>
            </View>
            <View>
              <Text style={s.footerCompany}>Walker Vision Co.</Text>
              <Text style={s.footerDetail}>
                walkerco.constructioncompany@gmail.com | +1 (901) 318-2013
              </Text>
              <Text style={s.footerDetail}>1804 N McAuthor, Oklahoma City, OK, USA</Text>
              <Text style={s.footerDetail}>walkervisionco.com</Text>
            </View>
          </View>

          <AsciiRule />
          <Text style={s.footerThanks}>Thank you for choosing Walker Vision Co.</Text>
        </View>
      </Page>
    </Document>
  );
}
