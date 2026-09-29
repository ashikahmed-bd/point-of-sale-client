<script setup>
import VueApexCharts from 'vue3-apexcharts'

const series = [
  {
    name: 'Sales',
    data: [
      [new Date('2026-06-01').getTime(), 1200],
      [new Date('2026-06-02').getTime(), 1800],
      [new Date('2026-06-03').getTime(), 2400],
      [new Date('2026-06-04').getTime(), 3500],
      [new Date('2026-06-05').getTime(), 3600],
      [new Date('2026-06-06').getTime(), 2900],
      [new Date('2026-06-07').getTime(), 3200],
      [new Date('2026-06-08').getTime(), 3800],
      [new Date('2026-06-09').getTime(), 4500],
      [new Date('2026-06-10').getTime(), 4100],
      [new Date('2026-06-11').getTime(), 5000],
      [new Date('2026-06-12').getTime(), 6500],
      [new Date('2026-06-13').getTime(), 4800],
      [new Date('2026-06-14').getTime(), 5300],
      [new Date('2026-06-15').getTime(), 6800],
      [new Date('2026-06-16').getTime(), 6200],
      [new Date('2026-06-17').getTime(), 6500],
    ],
  },
]

const chartOptions = {
  chart: {
    type: 'area',
    height: 180,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    fontFamily: 'inherit',
  },

  colors: ['#2563eb'],

  dataLabels: {
    enabled: false,
  },

  stroke: {
    curve: 'smooth',
    width: 2,
  },

  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.22,
      opacityTo: 0.02,
      stops: [0, 100],
    },
  },

  markers: {
    size: 0,
    hover: {
      size: 4,
    },
  },

  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 3,
    padding: {
      top: 0,
      right: 8,
      bottom: 0,
      left: 0,
    },
  },

  xaxis: {
    type: 'datetime',

    axisBorder: {
      show: false,
    },

    axisTicks: {
      show: false,
    },

    labels: {
      datetimeUTC: false,
      style: {
        colors: '#94a3b8',
        fontSize: '12px',
      },

      format: 'MMM d',
    },
  },

  yaxis: {
    min: 0,
    max: 8000,
    tickAmount: 4,

    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '12px',
      },

      formatter: (value) => {
        if (value === 0) {
          return '0'
        }

        return `${value / 1000}K`
      },
    },
  },

  tooltip: {
    x: {
      format: 'MMM dd, yyyy',
    },

    y: {
      formatter: (value) => {
        return `$${value.toLocaleString()}`
      },
    },
  },

  legend: {
    show: false,
  },
}

const orderStatusOptions = {
  chart: {
    type: 'donut',
    height: 170,
    width: 170,
    toolbar: {
      show: false,
    },
  },

  colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],

  labels: ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'],

  stroke: {
    width: 2,
    colors: ['#ffffff'],
  },

  dataLabels: {
    enabled: false,
  },

  legend: {
    show: false,
  },

  plotOptions: {
    pie: {
      expandOnClick: false,

      donut: {
        size: '68%',

        labels: {
          show: true,

          name: {
            show: false,
          },

          value: {
            show: false,
          },

          total: {
            show: true,
            showAlways: true,

            label: 'Total Orders',

            fontSize: '12px',
            fontWeight: 400,
            color: '#64748b',

            formatter: () => '248',
          },
        },
      },
    },
  },

  tooltip: {
    enabled: false,
  },
}

const orderStatusSeries = [180, 32, 18, 12, 6]
</script>

<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="flex items-start justify-between px-4 pt-4">
        <div class="flex items-center gap-2.5">
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
          >
            <UIcon name="i-lucide-chart-column-increasing" class="size-4" />
          </div>
          <h3 class="text-sm font-semibold leading-5 text-slate-800">Sales Overview</h3>
        </div>

        <button
          type="button"
          class="flex h-8 items-center gap-5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Sales
          <UIcon name="i-lucide-chevron-down" class="size-4 text-slate-400" />
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2 px-4 pt-2">
        <span class="text-xl font-bold tracking-tight text-slate-900"> $18,540.00 </span>
        <span class="flex items-center gap-1 text-sm font-semibold text-emerald-600">
          <UIcon name="i-lucide-arrow-up" class="size-4" />

          28%
        </span>
        <span class="text-sm text-slate-400"> from last month </span>
      </div>

      <div class="px-2">
        <VueApexCharts type="area" height="180" :options="chartOptions" :series="series" />
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <!-- Header -->
      <div class="flex items-center gap-2.5 px-4 pt-4">
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
        >
          <UIcon name="i-lucide-clipboard-check" class="size-4" />
        </div>

        <h3 class="text-sm font-semibold text-slate-800">Order Status</h3>
      </div>

      <!-- Content -->
      <div class="flex items-center gap-2 px-3 pb-3 pt-1">
        <!-- Donut -->
        <div class="flex shrink-0 items-center justify-center">
          <VueApexCharts
            type="donut"
            height="170"
            width="170"
            :options="orderStatusOptions"
            :series="orderStatusSeries"
          />
        </div>

        <!-- Status List -->
        <div class="min-w-0 flex-1 space-y-2.5 pr-1">
          <!-- Delivered -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full bg-emerald-500" />

              <span class="truncate text-sm text-slate-500"> Delivered </span>
            </div>

            <span class="shrink-0 text-sm font-semibold text-slate-600"> 180 </span>
          </div>

          <!-- Processing -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full bg-blue-500" />

              <span class="truncate text-sm text-slate-500"> Processing </span>
            </div>

            <span class="shrink-0 text-sm font-semibold text-slate-600"> 32 </span>
          </div>

          <!-- Shipped -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full bg-violet-500" />

              <span class="truncate text-sm text-slate-500"> Shipped </span>
            </div>

            <span class="shrink-0 text-sm font-semibold text-slate-600"> 18 </span>
          </div>

          <!-- Pending -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full bg-amber-500" />

              <span class="truncate text-sm text-slate-500"> Pending </span>
            </div>

            <span class="shrink-0 text-sm font-semibold text-slate-600"> 12 </span>
          </div>

          <!-- Cancelled -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full bg-red-500" />

              <span class="truncate text-sm text-slate-500"> Cancelled </span>
            </div>

            <span class="shrink-0 text-sm font-semibold text-slate-600"> 6 </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
