<template>
  <Story title="default">
    <ATable
      :columns="http_logs.columns"
      :rows="http_logs.rows"
      :config="http_logs.config"
    />
  </Story>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import data from "@/assets/sample_data/http_logs.json";
import ATable from "@/components/ATable.vue";

const http_logs = ref({
  rows: data,
  columns: [
    {
      label: "Home Page",
      name: "home_page",
      type: "Data",
      align: "Left",
      edit: false,
      width: "35ch",
      format: (value) => {
        return value.title;
      },
    },
    {
      label: "HTTP Method",
      name: "http_method",
      type: "Data",
      align: "Left",
      edit: true,
      width: "20ch",
    },
    // {
    //   label: "IP Address",
    //   name: "ip_address",
    //   type: "Data",
    //   align: 'Left',
    //   edit: false,
    //   width: '20ch',
    // },
    // {
    //   label: "Status",
    //   name: "status",
    //   type: "Data",
    //   align: 'Left',
    //   edit: true,
    //   width: '35ch',
    // },
    {
      label: "Report Date",
      name: "report_date",
      type: "component",
      align: "Center",
      edit: true,
      width: "25ch",
      component: "ADate",
      format: (value) => {
        return new Date(Number(value)).toLocaleDateString("en-US");
      },
    },
  ],
  config: { numberedRows: true, treeView: false },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap");
@import "@/assets/atable.css";
</style>
