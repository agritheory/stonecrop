<template>
  <table class="atable">
    <slot name="tableheader">
      <ATableHeader
        :columns="tableData.columns"
        :config="tableData.config"
        :tableid="tableData.id"
      />
    </slot>
    <tbody>
      <ARow
        v-for="(row, rowIndex) in tableData.rows"
        :key="row.id || v4()"
        :row="row"
        :rowIndex="rowIndex"
        :tableid="tableData.id"
      >
        <ACell
          v-for="(col, colIndex) in tableData.columns"
          :key="colIndex"
          :tableid="tableData.id"
          :col="col"
          tabindex="0"
          spellcheck="false"
          :rowIndex="rowIndex"
          :colIndex="colIndex + (tableData.zeroColumn ? 0 : -1)"
          :style="{
            'text-align': col?.align?.toLowerCase() || 'center',
            'min-width': col?.width || '40ch',
          }"
        />
      </ARow>
    </tbody>
    <slot name="footer" />
    <ATableModal
      :colIndex="tableData.modal.colIndex"
      :rowIndex="tableData.modal.rowIndex"
      :tableid="tableData.id"
      v-show="tableData.modal.visible"
      :style="{
        left: tableData.modal.left + 'px',
        top: tableData.modal.top + 'px',
        'max-width': tableData.modal.width + 'px',
      }"
    >
      <component
        :is="tableData.modal.component"
        :colIndex="tableData.modal.colIndex"
        :rowIndex="tableData.modal.rowIndex"
        :tableid="tableData.id"
      />
    </ATableModal>
  </table>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { defineComponent, provide, nextTick } from "vue";

import TableDataStore, { TableColumn } from "./index";
import ACell from "./ACell.vue";
import ARow from "./ARow.vue";
import ATableHeader from "./ATableHeader.vue";
import ATableModal from "./ATableModal.vue";

export default defineComponent({
  name: "ATable",
  components: {
    ATableModal,
    ARow,
    ATableHeader,
    ACell,
  },
  props: {
    id: {
      type: String,
    },
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      default: [],
    },
    config: {
      type: Object,
      default: {},
    },
    tableid: {
      type: String,
    },
  },
  setup(props) {
    let tableData = new TableDataStore(
      props.id,
      props.columns,
      props.rows,
      props.config
    );

    provide(tableData.id, tableData);

    const formatCell = (
      // TODO: (typing) what kind of event are we catching here?
      event?: Event,
      column?: TableColumn,
      cellData?: any
    ) => {
      let colIndex: number;
      if (event) {
        colIndex = event.target.cellIndex + (tableData.zeroColumn ? -1 : 0);
      } else if (column && cellData) {
        colIndex = tableData.columns.indexOf(column);
      }

      if (!column && "format" in tableData.columns[colIndex]) {
        event.target.innerHTML = tableData.columns[colIndex].format(
          event.target.innerHTML
        );
      } else if (cellData && "format" in column) {
        return column.format(cellData);
      } else if (
        cellData &&
        column.type.toLowerCase() in
          ["int", "decimal", "float", "number", "percent"]
      ) {
        return cellData;
        // TODO: number formatting
      } else {
        return cellData;
      }
    };

    const getIndent = (colKey: number, indent: number) => {
      if (indent && colKey === 0 && indent > 0) {
        return indent * 1 + "ch";
      } else {
        return null;
      }
    };

    const enterNav = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.shiftKey ? upCell(event) : downCell(event);
    };

    const tabNav = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.shiftKey ? prevCell(event) : nextCell(event);
    };

    const downArrowNav = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        downCell(event);
      }
    };

    const upArrowNav = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        upCell(event);
      }
    };

    const leftArrowNav = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        prevCell(event);
      }
    };

    const rightArrowNav = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        nextCell(event);
      }
    };

    // TODO: (typing) is this not a keyboard event?
    const endNav = (event: KeyboardEvent) => {
      let nextCellEl = undefined;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) {
        // last column
        return;
      } else {
        nextCellEl =
          tableEl.rows[rowIndex - 1].cells[
            tableData.columns.length - (tableData.zeroColumn === true ? 0 : 1)
          ]; // last cell
      }
      nextCellEl.focus();
    };

    // TODO: (typing) is this not a keyboard event?
    const homeNav = (event: KeyboardEvent) => {
      let nextCellEl = undefined;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (cellIndex === (tableData.config.numberedRows === true ? 1 : 0)) {
        // TODO: zeroColumn // first column
        return;
      } else {
        nextCellEl =
          tableEl.rows[rowIndex - 1].cells[
            tableData.zeroColumn === true ? 1 : 0
          ]; // last cell
      }
      nextCellEl.focus();
    };

    // TODO: (typing) is this not a keyboard event?
    const downCell = (event: KeyboardEvent) => {
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      let cell = undefined;
      if (tableEl.rows.length !== rowIndex) {
        // not bottom row
        cell = tableEl.rows[rowIndex].cells[cellIndex];
        if (
          tableData.config.treeView === true &&
          tableData.display[rowIndex].open === false
        ) {
          // toggleRowExpand(event, rowIndex - 1)
          tableData.toggleRowExpand(rowIndex - 1);
        }
      } else {
        cell = event.target;
      }
      nextTick(() => {
        cell.focus();
      });
    };

    // TODO: (typing) is this not a keyboard event?
    const upCell = (event: KeyboardEvent) => {
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const table = event.target.parentElement.parentElement;
      let cell = undefined;
      if (rowIndex !== 1) {
        // not top row, exclude headers
        cell = table.rows[rowIndex - 2].cells[cellIndex];
        if (
          tableData.config.treeView === true &&
          tableData.display[rowIndex - 2].open === false
        ) {
          tableData.toggleRowExpand(tableData.display[rowIndex - 2].parent);
        }
      } else {
        cell = event.target;
      }
      nextTick(() => {
        cell.focus();
      });
    };

    // TODO: (typing) is this not a keyboard event?
    const nextCell = (event: KeyboardEvent) => {
      let nextCellEl = undefined;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) {
        // last column
        if (tableEl.rows.length === rowIndex) {
          nextCellEl =
            tableEl.rows[0].cells[tableData.zeroColumn === true ? 1 : 0]; // go to top left cell
          // if row is hidden, expand
        } else {
          // focus on first cell of next row
          nextCellEl =
            tableEl.rows[rowIndex].cells[tableData.zeroColumn === true ? 1 : 0];
          if (
            tableData.config.treeView === true &&
            tableData.display[rowIndex].open === false
          ) {
            tableData.toggleRowExpand(rowIndex - 1);
          }
        }
      } else {
        nextCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex + 1]; // next cell
      }
      nextTick(() => {
        nextCellEl.focus();
      });
    };

    // TODO: (typing) is this not a keyboard event?
    const prevCell = (event: KeyboardEvent) => {
      let prevCellEl = undefined;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (cellIndex === (tableData.zeroColumn === true ? 1 : 0)) {
        // first column
        if (rowIndex !== 1) {
          // not top row, exclude headers
          prevCellEl =
            tableEl.rows[rowIndex - 2].cells[
              tableEl.rows[rowIndex - 2].cells.length - 1
            ];
          // toggleRowExpand(event, rowIndex - 2)
          tableData.toggleRowExpand(rowIndex - 2);
        } else {
          // top row, stay trapped in top left cell
          return;
        }
      } else {
        prevCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex - 1]; // previous cell
      }
      prevCellEl.focus();
    };

    const moveCursorToEnd = (target: HTMLElement) => {
      target.focus();
      document.execCommand("selectAll", false, null);
      document.getSelection().collapseToEnd();
    };

    const clickOutside = (event: MouseEvent) => {
      if (!tableData.modal.parent) {
        return;
      }

      // TODO: (typing) possible bug?
      if (tableData.modal.parent.contains(event.target)) {
      } else {
        if (!tableData.modal.visible) {
          return;
        } else {
          // call set data
          tableData.modal.visible = false;
        }
      }
    };

    window.addEventListener("click", clickOutside);

    return {
      downArrowNav,
      downCell,
      endNav,
      enterNav,
      formatCell,
      getIndent,
      homeNav,
      leftArrowNav,
      moveCursorToEnd,
      nextCell,
      prevCell,
      rightArrowNav,
      tableData,
      tabNav,
      upArrowNav,
      upCell,
      v4,
    };
  },
});
</script>

<style scoped>
table {
  display: table;
  border-collapse: var(--border-collapsed);
  caret-color: var(--brand-color);
}

th {
  box-sizing: border-box;
  background-color: var(--brand-color);
  border-width: 1px;
  border-style: solid;
  border-color: var(--header-border-color);
  border-radius: 0px;
  color: var(--header-text-color);
}

tr {
  background-color: var(--row-color-zebra-light);
  outline: none;
}

tr:nth-child(even) {
  background-color: var(--row-color-zebra-dark);
}
</style>
