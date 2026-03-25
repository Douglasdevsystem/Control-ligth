// Dados mockados para a aplicação
export interface Asset {
  id: string;
  name: string;
  type:
    | "ar-condicionado"
    | "lampada"
    | "ventilador"
    | "projetor";
  status: "ligado" | "desligado";
  consumo: number; // kWh
}

export interface Sala {
  id: string;
  nome: string;
  corredorId: string; // ID do corredor que a sala pertence
  ativos: Asset[];
  consumoTotal: number;
  horariosProgramados: {
    inicio: string;
    fim: string;
    diasSemana: string[];
  }[];
}

export interface Corredor {
  id: string;
  nome: string;
  descricao?: string;
}

export interface Escola {
  id: string;
  nome: string;
  endereco: string;
  prefeituraId: string; // ID da prefeitura que a escola pertence
  consumoMesAtual: number; // kWh
  consumoMesAnterior: number; // kWh
  corredores: Corredor[]; // Corredores da escola
  salas: Sala[];
  historico: {
    id: string;
    mes: string;
    consumo: number;
  }[];
}

export interface Prefeitura {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  telefone: string;
  email: string;
}

// Dados das prefeituras
export const prefeituras: Prefeitura[] = [
  {
    id: "pref-1",
    nome: "Prefeitura Municipal de São Paulo",
    cidade: "São Paulo",
    estado: "SP",
    responsavel: "Carlos Alberto Silva",
    telefone: "(11) 3333-4444",
    email: "prefeitura.sp@gov.br",
  },
  {
    id: "pref-2",
    nome: "Prefeitura Municipal do Rio de Janeiro",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    responsavel: "Maria Fernanda Costa",
    telefone: "(21) 2222-3333",
    email: "prefeitura.rj@gov.br",
  },
];

// Dados das escolas (agora vinculadas às prefeituras)
export const escolas: Escola[] = [
  // Escolas de São Paulo (pref-1)
  {
    id: "escola-1",
    nome: "Escola Municipal Prof. João Silva",
    endereco: "Rua das Flores, 123 - Centro",
    prefeituraId: "pref-1",
    consumoMesAtual: 1085, // 285 + 265 + 275 + 260
    consumoMesAnterior: 4850,
    historico: [
      { id: "1-1", mes: "Set", consumo: 4500 },
      { id: "1-2", mes: "Out", consumo: 4650 },
      { id: "1-3", mes: "Nov", consumo: 4850 },
      { id: "1-4", mes: "Dez", consumo: 4250 },
      { id: "1-5", mes: "Jan", consumo: 3950 },
    ],
    corredores: [
      {
        id: "c1-1",
        nome: "Corredor Leste",
        descricao: "Salas do 1º ano",
      },
      {
        id: "c1-2",
        nome: "Corredor Oeste",
        descricao: "Salas do 2º ano",
      },
    ],
    salas: [
      {
        id: "1-1",
        nome: "Sala 1A",
        corredorId: "c1-1",
        consumoTotal: 285,
        horariosProgramados: [
          {
            inicio: "07:00",
            fim: "12:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
          {
            inicio: "13:00",
            fim: "17:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
        ],
        ativos: [
          {
            id: "a1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 180,
          },
          {
            id: "a2",
            name: "Lâmpadas LED (8 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 48,
          },
          {
            id: "a3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "desligado",
            consumo: 25,
          },
          {
            id: "a4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "ligado",
            consumo: 32,
          },
        ],
      },
      {
        id: "1-2",
        nome: "Sala 1B",
        corredorId: "c1-1",
        consumoTotal: 265,
        horariosProgramados: [
          {
            inicio: "07:00",
            fim: "12:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
        ],
        ativos: [
          {
            id: "b1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 180,
          },
          {
            id: "b2",
            name: "Lâmpadas LED (8 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 48,
          },
          {
            id: "b3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "ligado",
            consumo: 25,
          },
          {
            id: "b4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "desligado",
            consumo: 12,
          },
        ],
      },
      {
        id: "1-3",
        nome: "Sala 2A",
        corredorId: "c1-2",
        consumoTotal: 275,
        horariosProgramados: [
          {
            inicio: "07:00",
            fim: "12:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
        ],
        ativos: [
          {
            id: "z1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 185,
          },
          {
            id: "z2",
            name: "Lâmpadas LED (8 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 48,
          },
          {
            id: "z3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "desligado",
            consumo: 25,
          },
          {
            id: "z4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "ligado",
            consumo: 17,
          },
        ],
      },
      {
        id: "1-4",
        nome: "Sala 2B",
        corredorId: "c1-2",
        consumoTotal: 260,
        horariosProgramados: [
          {
            inicio: "07:00",
            fim: "12:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
        ],
        ativos: [
          {
            id: "y1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 175,
          },
          {
            id: "y2",
            name: "Lâmpadas LED (8 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 48,
          },
          {
            id: "y3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "ligado",
            consumo: 25,
          },
          {
            id: "y4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "desligado",
            consumo: 12,
          },
        ],
      },
    ],
  },
  {
    id: "escola-2",
    nome: "Escola Municipal Maria Santos",
    endereco: "Av. Brasil, 456 - Jardim América",
    prefeituraId: "pref-1",
    consumoMesAtual: 3890,
    consumoMesAnterior: 4120,
    historico: [
      { id: "2-1", mes: "Set", consumo: 4200 },
      { id: "2-2", mes: "Out", consumo: 4350 },
      { id: "2-3", mes: "Nov", consumo: 4120 },
      { id: "2-4", mes: "Dez", consumo: 3890 },
      { id: "2-5", mes: "Jan", consumo: 3650 },
    ],
    corredores: [
      {
        id: "c2-1",
        nome: "Corredor Principal",
        descricao: "Corredor principal da escola",
      },
    ],
    salas: [
      {
        id: "2-1",
        nome: "Sala 1B",
        corredorId: "c2-1",
        consumoTotal: 295,
        horariosProgramados: [
          {
            inicio: "07:30",
            fim: "12:30",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
          {
            inicio: "13:30",
            fim: "17:30",
            diasSemana: ["Seg", "Ter", "Qua", "Qui"],
          },
        ],
        ativos: [
          {
            id: "c1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 190,
          },
          {
            id: "c2",
            name: "Lâmpadas LED (10 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 60,
          },
          {
            id: "c3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "desligado",
            consumo: 25,
          },
          {
            id: "c4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "ligado",
            consumo: 20,
          },
        ],
      },
    ],
  },
  {
    id: "escola-3",
    nome: "Escola Municipal Dom Pedro II",
    endereco: "Rua Sete de Setembro, 789 - Vila Nova",
    prefeituraId: "pref-1",
    consumoMesAtual: 5120,
    consumoMesAnterior: 5650,
    historico: [
      { id: "3-1", mes: "Set", consumo: 5800 },
      { id: "3-2", mes: "Out", consumo: 5950 },
      { id: "3-3", mes: "Nov", consumo: 5650 },
      { id: "3-4", mes: "Dez", consumo: 5120 },
      { id: "3-5", mes: "Jan", consumo: 4850 },
    ],
    corredores: [
      {
        id: "c3-1",
        nome: "Corredor Principal",
        descricao: "Corredor principal da escola",
      },
    ],
    salas: [
      {
        id: "3-1",
        nome: "Laboratório de Informática",
        corredorId: "c3-1",
        consumoTotal: 485,
        horariosProgramados: [
          {
            inicio: "08:00",
            fim: "12:00",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
          {
            inicio: "14:00",
            fim: "18:00",
            diasSemana: ["Seg", "Ter", "Qua"],
          },
        ],
        ativos: [
          {
            id: "d1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 220,
          },
          {
            id: "d2",
            name: "Lâmpadas LED (12 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 72,
          },
          {
            id: "d3",
            name: "Ventilador de Teto (2 unidades)",
            type: "ventilador",
            status: "ligado",
            consumo: 50,
          },
          {
            id: "d4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "desligado",
            consumo: 28,
          },
        ],
      },
    ],
  },
  // Escolas do Rio de Janeiro (pref-2)
  {
    id: "escola-4",
    nome: "Escola Municipal Tiradentes",
    endereco: "Praça da Liberdade, 101 - Bairro Alto",
    prefeituraId: "pref-2",
    consumoMesAtual: 3650,
    consumoMesAnterior: 3980,
    historico: [
      { id: "4-1", mes: "Set", consumo: 4100 },
      { id: "4-2", mes: "Out", consumo: 4050 },
      { id: "4-3", mes: "Nov", consumo: 3980 },
      { id: "4-4", mes: "Dez", consumo: 3650 },
      { id: "4-5", mes: "Jan", consumo: 3450 },
    ],
    corredores: [
      {
        id: "c4-1",
        nome: "Corredor Principal",
        descricao: "Corredor principal da escola",
      },
    ],
    salas: [
      {
        id: "4-1",
        nome: "Sala 3C",
        corredorId: "c4-1",
        consumoTotal: 255,
        horariosProgramados: [
          {
            inicio: "07:00",
            fim: "11:30",
            diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex"],
          },
        ],
        ativos: [
          {
            id: "e1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "desligado",
            consumo: 170,
          },
          {
            id: "e2",
            name: "Lâmpadas LED (6 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 36,
          },
          {
            id: "e3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "ligado",
            consumo: 25,
          },
          {
            id: "e4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "desligado",
            consumo: 24,
          },
        ],
      },
    ],
  },
  {
    id: "escola-5",
    nome: "Escola Municipal Monteiro Lobato",
    endereco: "Rua dos Sonhos, 250 - Jardim das Acácias",
    prefeituraId: "pref-2",
    consumoMesAtual: 4580,
    consumoMesAnterior: 5100,
    historico: [
      { id: "5-1", mes: "Set", consumo: 5250 },
      { id: "5-2", mes: "Out", consumo: 5350 },
      { id: "5-3", mes: "Nov", consumo: 5100 },
      { id: "5-4", mes: "Dez", consumo: 4580 },
      { id: "5-5", mes: "Jan", consumo: 4280 },
    ],
    corredores: [
      {
        id: "c5-1",
        nome: "Corredor Principal",
        descricao: "Corredor principal da escola",
      },
    ],
    salas: [
      {
        id: "5-1",
        nome: "Sala de Leitura",
        corredorId: "c5-1",
        consumoTotal: 210,
        horariosProgramados: [
          {
            inicio: "08:00",
            fim: "12:00",
            diasSemana: ["Seg", "Qua", "Sex"],
          },
          {
            inicio: "14:00",
            fim: "17:00",
            diasSemana: ["Ter", "Qui"],
          },
        ],
        ativos: [
          {
            id: "f1",
            name: "Ar-Condicionado Principal",
            type: "ar-condicionado",
            status: "ligado",
            consumo: 150,
          },
          {
            id: "f2",
            name: "Lâmpadas LED (6 unidades)",
            type: "lampada",
            status: "ligado",
            consumo: 36,
          },
          {
            id: "f3",
            name: "Ventilador de Teto",
            type: "ventilador",
            status: "desligado",
            consumo: 20,
          },
          {
            id: "f4",
            name: "Projetor Multimídia",
            type: "projetor",
            status: "desligado",
            consumo: 4,
          },
        ],
      },
    ],
  },
];

// Funções auxiliares
export const getEscolasByPrefeitura = (
  prefeituraId: string,
) => {
  return escolas.filter(
    (escola) => escola.prefeituraId === prefeituraId,
  );
};

export const getPrefeituraById = (prefeituraId: string) => {
  return prefeituras.find((pref) => pref.id === prefeituraId);
};

// Cálculos por prefeitura
export const getDashboardPrefeitura = (
  prefeituraId: string,
) => {
  const escolasPrefeitura =
    getEscolasByPrefeitura(prefeituraId);

  const consumoTotalAtual = escolasPrefeitura.reduce(
    (sum, escola) => sum + escola.consumoMesAtual,
    0,
  );
  const consumoTotalAnterior = escolasPrefeitura.reduce(
    (sum, escola) => sum + escola.consumoMesAnterior,
    0,
  );

  const reducaoConsumo =
    consumoTotalAnterior - consumoTotalAtual;
  const percentualReducao =
    consumoTotalAnterior > 0
      ? ((reducaoConsumo / consumoTotalAnterior) * 100).toFixed(
          1,
        )
      : "0.0";

  const tendenciaReducao = 0.08;
  const previsaoProximoMes =
    consumoTotalAtual * (1 - tendenciaReducao);
  const economiaPrevista =
    (consumoTotalAtual - previsaoProximoMes) * 0.9;

  return {
    consumoTotal: consumoTotalAtual,
    consumoMesAnterior: consumoTotalAnterior,
    reducaoConsumo,
    percentualReducao,
    previsaoProximoMes: Math.round(previsaoProximoMes),
    economiaPrevista: Math.round(economiaPrevista),
    totalEscolas: escolasPrefeitura.length,
    totalSalas: escolasPrefeitura.reduce(
      (sum, escola) => sum + escola.salas.length,
      0,
    ),
  };
};

// Cálculos gerais (Admin - todas as prefeituras)
export const getDashboardAdmin = () => {
  const consumoTotalAtual = escolas.reduce(
    (sum, escola) => sum + escola.consumoMesAtual,
    0,
  );
  const consumoTotalAnterior = escolas.reduce(
    (sum, escola) => sum + escola.consumoMesAnterior,
    0,
  );

  const reducaoConsumo =
    consumoTotalAnterior - consumoTotalAtual;
  const percentualReducao = (
    (reducaoConsumo / consumoTotalAnterior) *
    100
  ).toFixed(1);

  const tendenciaReducao = 0.08;
  const previsaoProximoMes =
    consumoTotalAtual * (1 - tendenciaReducao);
  const economiaPrevista =
    (consumoTotalAtual - previsaoProximoMes) * 0.9;

  return {
    consumoTotalAtual,
    consumoTotalAnterior,
    reducaoConsumo,
    percentualReducao,
    previsaoProximoMes: Math.round(previsaoProximoMes),
    economiaPrevista: Math.round(economiaPrevista),
    totalPrefeituras: prefeituras.length,
    totalEscolas: escolas.length,
  };
};