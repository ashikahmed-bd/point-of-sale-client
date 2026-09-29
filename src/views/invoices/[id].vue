<script setup></script>

<template>
  <main>
    <div
      class="mx-auto w-full max-w-4xl relative rounded-xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm"
    >
      <div
        class="absolute right-10 top-4 rotate-[8deg] rounded-lg border-[3px] border-green-600 px-[18px] py-1 text-xl font-black uppercase tracking-[2px] text-green-600 opacity-85"
      >
        PAID
      </div>

      <div
        class="mb-9 flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-6"
      >
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_2px_8px_rgba(34,181,115,0.3)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="white" fill-opacity="0.2" />
              <path
                d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
                stroke="white"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path d="M12 22V12" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M3 7l9 5 9-5" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="2.5" fill="white" stroke="white" stroke-width="0.5" />
            </svg>
          </div>

          <div class="border-l border-slate-200 pl-3">
            <div class="text-[22px] font-bold leading-[1.1] tracking-[-0.3px]">Invenza</div>

            <div
              class="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-emerald-600"
            >
              Inventory Management
            </div>
          </div>
        </div>

        <!-- Company Info -->
        <div class="text-right">
          <div class="text-sm font-bold">Invenza Inc.</div>

          <div class="mt-0.5 text-xs text-slate-500">100 Tech Park Avenue, Suite 400</div>

          <div class="text-xs text-slate-500">San Francisco, CA 94107, USA</div>

          <div class="text-xs text-slate-500">contact@invenza.io | +1 (555) 019-2834</div>

          <div class="text-xs text-slate-500">Tax ID: US-994820184</div>
        </div>
      </div>

      <!-- Bill To / Invoice Info -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Billed To -->
        <div>
          <div class="mb-2 text-[11px] font-bold uppercase tracking-[0.6px] text-slate-500">
            Billed To:
          </div>

          <div class="text-[15px] font-bold">John Smith</div>

          <div class="mt-0.5 text-[13px] text-slate-500">Acme Commercial Supplies</div>

          <div class="text-[13px] text-slate-500">742 Evergreen Terrace, Springfield, OR</div>

          <div class="text-[13px] text-slate-500">john@smith.com | +1 (555) 384-9912</div>
        </div>

        <!-- Invoice Info -->
        <div class="flex flex-col gap-2 rounded-xl bg-slate-50 p-[18px]">
          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Invoice Number: </span>

            <span class="font-mono font-bold"> INV-000125 </span>
          </div>

          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Issue Date: </span>

            <span class="font-semibold"> August 24, 2026 </span>
          </div>

          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Due Date: </span>

            <span class="font-semibold"> September 07, 2026 </span>
          </div>

          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Payment Method: </span>

            <span class="font-semibold"> Cash (Receipt #8841) </span>
          </div>
        </div>
      </div>

      <!-- Line Items -->
      <div class="mb-6 overflow-x-auto rounded-lg border border-slate-200">
        <table class="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th
                class="w-[50px] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                #
              </th>

              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Item &amp; Description
              </th>

              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                SKU
              </th>

              <th
                class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Unit Price
              </th>

              <th
                class="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Qty
              </th>

              <th
                class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Tax (10%)
              </th>

              <th
                class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Total Amount
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Item 1 -->
            <tr class="border-b border-slate-100">
              <td class="px-4 py-4 text-xs text-slate-500">1</td>

              <td class="px-4 py-4">
                <div class="font-semibold">Wireless Mouse Pro</div>

                <div class="text-[11px] text-slate-500">
                  Ergonomic 2.4GHz USB-C rechargeable optical mouse
                </div>
              </td>

              <td class="px-4 py-4 font-mono text-xs text-slate-500">WM-001</td>

              <td class="px-4 py-4 text-right text-[13px]">$29.99</td>

              <td class="px-4 py-4 text-center font-semibold">10</td>

              <td class="px-4 py-4 text-right text-[13px] text-slate-500">$29.99</td>

              <td class="px-4 py-4 text-right font-bold">$329.89</td>
            </tr>

            <!-- Item 2 -->
            <tr class="border-b border-slate-100">
              <td class="px-4 py-4 text-xs text-slate-500">2</td>

              <td class="px-4 py-4">
                <div class="font-semibold">Mechanical Keyboard</div>

                <div class="text-[11px] text-slate-500">
                  RGB Backlit Linear Red switches with detachable braided cord
                </div>
              </td>

              <td class="px-4 py-4 font-mono text-xs text-slate-500">MK-002</td>

              <td class="px-4 py-4 text-right text-[13px]">$89.99</td>

              <td class="px-4 py-4 text-center font-semibold">4</td>

              <td class="px-4 py-4 text-right text-[13px] text-slate-500">$36.00</td>

              <td class="px-4 py-4 text-right font-bold">$395.96</td>
            </tr>

            <!-- Item 3 -->
            <tr>
              <td class="px-4 py-4 text-xs text-slate-500">3</td>

              <td class="px-4 py-4">
                <div class="font-semibold">USB-C Hub (7-in-1)</div>

                <div class="text-[11px] text-slate-500">
                  4K HDMI, 100W Power Delivery, SD/TF card reader
                </div>
              </td>

              <td class="px-4 py-4 font-mono text-xs text-slate-500">UH-003</td>

              <td class="px-4 py-4 text-right text-[13px]">$49.99</td>

              <td class="px-4 py-4 text-center font-semibold">2</td>

              <td class="px-4 py-4 text-right text-[13px] text-slate-500">$10.00</td>

              <td class="px-4 py-4 text-right font-bold">$109.98</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="mb-8 flex justify-end">
        <div class="flex w-[320px] flex-col gap-[10px]">
          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Subtotal: </span>

            <span class="font-semibold"> $768.15 </span>
          </div>

          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Discount (0%): </span>

            <span class="text-slate-500"> $0.00 </span>
          </div>

          <div class="flex justify-between text-[13px]">
            <span class="text-slate-500"> Tax (VAT 10%): </span>

            <span class="font-semibold"> $76.85 </span>
          </div>

          <div
            class="mt-1 flex justify-between border-t-2 border-slate-200 pt-[10px] text-lg font-extrabold"
          >
            <span> Grand Total: </span>

            <span class="text-emerald-600"> $845.00 </span>
          </div>

          <div
            class="mt-1.5 flex justify-between rounded-lg bg-emerald-50 px-3 py-2 text-[13px] font-semibold text-emerald-600"
          >
            <span> Amount Paid: </span>

            <span> $845.00 </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-wrap items-end justify-between gap-5 border-t border-slate-200 pt-5">
        <!-- Payment Terms -->
        <div class="max-w-[400px]">
          <div class="mb-1 text-xs font-bold">Payment Terms &amp; Instructions</div>

          <div class="text-[11px] leading-relaxed text-slate-500">
            Payment is due within 14 days of invoice issuance. For electronic wire transfers, please
            reference INV-000125 in the memo line.
            <br />
            Bank: Silicon Valley Commerce Bank • Routing: 121000358 • Account: 9948-2849-01
          </div>
        </div>

        <!-- Signature -->
        <div class="text-center">
          <div class="mb-1 font-mono text-lg tracking-[2px] text-slate-500">J. Smith</div>

          <div class="mx-auto mb-1 w-[140px] border-t border-slate-400"></div>

          <div class="text-[11px] text-slate-500">Authorized Signature</div>
        </div>
      </div>
    </div>
  </main>
</template>
