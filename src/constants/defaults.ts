import type { Scenario } from '../types';

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'scen-colombia',
    name: '🇨🇴 Mi perfil en Colombia',
    currency: 'COP',
    customRateToUSD: 4150,
    colorTheme: '#0284c7', // Sky Blue
    incomeConfig: {
      incomeFrequency: 'monthly',
      nominalAmount: 3800000, // 3.8M COP mensuales
      weeklyWorkHours: 44,
      taxDeductionsMonthly: 380000, // Salud y pensión (~10%)
      commuteExpensesMonthly: 280000, // Transmilenio / Gasolina moto
      workOtherExpensesMonthly: 200000, // Almuerzos fuera, café, datos
      commuteHoursWeekly: 10, // 2h diarias de trancones ida y vuelta
      prepHoursWeekly: 3, // Preparación, alistarse
    },
    items: [
      {
        id: 'item-col-1',
        name: 'Tenis Deportivos de Marca',
        price: 450000,
        category: 'Ropa y Calzado',
        emoji: '👟',
        createdAt: 1,
      },
      {
        id: 'item-col-2',
        name: 'Smartphone Gama Media-Alta',
        price: 2600000,
        category: 'Tecnología',
        emoji: '📱',
        createdAt: 2,
      },
      {
        id: 'item-col-3',
        name: 'Salida a Cenar en Pareja',
        price: 180000,
        category: 'Alimentación y Salidas',
        emoji: '🍷',
        createdAt: 3,
      },
      {
        id: 'item-col-4',
        name: 'Moto 150cc Usada',
        price: 6800000,
        category: 'Transporte y Viajes',
        emoji: '🏍️',
        createdAt: 4,
      },
      {
        id: 'item-col-5',
        name: 'Suscripción Mensual Gimnasio',
        price: 110000,
        category: 'Salud y Cuidado',
        emoji: '🏋️',
        createdAt: 5,
      },
    ],
  },
  {
    id: 'scen-canada',
    name: '🇨🇦 Mi proyección en Canadá',
    currency: 'CAD',
    customRateToUSD: 1.36,
    colorTheme: '#e11d48', // Crimson Red
    incomeConfig: {
      incomeFrequency: 'hourly',
      nominalAmount: 32, // 32 CAD/hora
      weeklyWorkHours: 37.5,
      taxDeductionsMonthly: 1100, // Impuestos provinciales y federales
      commuteExpensesMonthly: 156, // Pase mensual TTC / Metro
      workOtherExpensesMonthly: 180, // Comida rápida, café
      commuteHoursWeekly: 6, // 1.2h diarias
      prepHoursWeekly: 2,
    },
    items: [
      {
        id: 'item-can-1',
        name: 'Tenis Deportivos de Marca',
        price: 135,
        category: 'Ropa y Calzado',
        emoji: '👟',
        createdAt: 1,
      },
      {
        id: 'item-can-2',
        name: 'Smartphone Gama Media-Alta',
        price: 850,
        category: 'Tecnología',
        emoji: '📱',
        createdAt: 2,
      },
      {
        id: 'item-can-3',
        name: 'Salida a Cenar en Pareja',
        price: 95,
        category: 'Alimentación y Salidas',
        emoji: '🍷',
        createdAt: 3,
      },
      {
        id: 'item-can-4',
        name: 'Carro Usado Confiable',
        price: 5500,
        category: 'Transporte y Viajes',
        emoji: '🚗',
        createdAt: 4,
      },
      {
        id: 'item-can-5',
        name: 'Suscripción Mensual Gimnasio',
        price: 55,
        category: 'Salud y Cuidado',
        emoji: '🏋️',
        createdAt: 5,
      },
    ],
  },
  {
    id: 'scen-spain',
    name: '🇪🇸 Perfil de mi hermana en España',
    currency: 'EUR',
    customRateToUSD: 0.92,
    colorTheme: '#f59e0b', // Amber / Spanish Gold
    incomeConfig: {
      incomeFrequency: 'monthly',
      nominalAmount: 2100, // 2,100 EUR brutos mensuales
      weeklyWorkHours: 40,
      taxDeductionsMonthly: 420, // IRPF + Seg. Social (~20%)
      commuteExpensesMonthly: 60, // Abono transporte Madrid
      workOtherExpensesMonthly: 120, // Menús de mediodía
      commuteHoursWeekly: 5, // Metro 1h diaria
      prepHoursWeekly: 2,
    },
    items: [
      {
        id: 'item-esp-1',
        name: 'Tenis Deportivos de Marca',
        price: 110,
        category: 'Ropa y Calzado',
        emoji: '👟',
        createdAt: 1,
      },
      {
        id: 'item-esp-2',
        name: 'Smartphone Gama Media-Alta',
        price: 650,
        category: 'Tecnología',
        emoji: '📱',
        createdAt: 2,
      },
      {
        id: 'item-esp-3',
        name: 'Salida a Cenar en Pareja',
        price: 65,
        category: 'Alimentación y Salidas',
        emoji: '🍷',
        createdAt: 3,
      },
      {
        id: 'item-esp-4',
        name: 'Escapada de Fin de Semana',
        price: 320,
        category: 'Transporte y Viajes',
        emoji: '✈️',
        createdAt: 4,
      },
      {
        id: 'item-esp-5',
        name: 'Suscripción Mensual Gimnasio',
        price: 39,
        category: 'Salud y Cuidado',
        emoji: '🏋️',
        createdAt: 5,
      },
    ],
  },
];
