import { brandsOverview, parentOverview, quarterlyOverview, monthlyOverview } from "./constants";

const quarterlyOverviewMap = Object.fromEntries(
    (quarterlyOverview?.quarterly || []).map((quarter) => [quarter.id, quarter])
);

const monthlyOverviewMap = Object.fromEntries(
    (monthlyOverview?.monthly || []).map((month) => [month.id, month])
);

const enrichedBrands = (brandsOverview?.brands || []).map((b) => ({
    ...b,
    sales: (b.sales || []).map((s) => ({
        ...s,
        quarterly: (s.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (s.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
    services: (b.services || []).map((s) => ({
        ...s,
        quarterly: (s.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (s.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
    expenses: (b.expenses || []).map((e) => ({
        ...e,
        quarterly: (e.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (e.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
    payments: (b.payments || []).map((p) => ({
        ...p,
        quarterly: (p.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (p.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
    inventory: (b.inventory || []).map((i) => ({
        ...i,
        quarterly: (i.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (i.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    }))
}));

// Remove all calculator helper functions and add direct totals
export const totals = {
    sales: {
        own: parentOverview.overallBrand[0].sales.find(s => s.type === "Own") || { salesCount: 0, salesValue: 0 },
        sub: parentOverview.overallBrand[0].sales.find(s => s.type === "Sub") || { salesCount: 0, salesValue: 0 }
    },
    services: {
        own: parentOverview.overallBrand[0].services.find(s => s.type === "Own") || { servicesCount: 0, servicesValue: 0 }
    }
};

export { enrichedBrands };

export const enrichedParent = (parentOverview?.overallBrand || []).map((b) => ({
    ...b,
    brands: (b.brandIds || []).map((id) => enrichedBrands.find((brand) => brand.id === id) || {}),
    sales: (b.sales || []).map((s) => ({
        ...s,
        quarterly: (s.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (s.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
    services: (b.services || []).map((s) => ({
        ...s,
        quarterly: (s.quarterlyIds || []).map((id) => quarterlyOverviewMap[id] || {}),
        monthly: (s.monthlyIds || []).map((id) => monthlyOverviewMap[id] || {}),
    })),
}));

