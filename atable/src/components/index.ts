import { v4 } from "uuid";
import { computed, reactive } from "vue";

export type Display = {
  default?: {
    modified: boolean;
    [key: string]: any;
  };
};

export type TableRow = {
  indent?: string;
  parent?: string;
  [key: string]: string;
};

export type TableColumn = {
  name: string;
  align?: string;
  edit?: boolean;
  format?: Function;
  label?: string;
  type?: string;
  width?: string;
};

export type TableModal = {
  colIndex?: number;
  component?: string;
  event?: string;
  left?: string;
  parent?: HTMLElement;
  rowIndex?: string;
  top?: string;
  visible?: boolean;
  width?: string;
};

export default class TableDataStore {
  id: string;
  rows: TableRow[];
  columns: TableColumn[];
  config: {
    numberedRows?: boolean;
    treeView?: boolean;
  };
  table: { [key: string]: any };
  // TODO: (typing) what is the actual display type?
  display: Display | Display["default"];
  modal: TableModal;

  constructor(
    id = undefined,
    columns = [],
    rows = [],
    config = {},
    table = undefined,
    display = undefined
  ) {
    this.id = id || v4();
    this.rows = rows;
    this.columns = reactive(columns);
    this.config = reactive(config);
    this.table = table || reactive(this.createTableObject());
    this.display = this.createDisplayObject(display);
    this.modal = reactive({ visible: false });
  }

  createTableObject() {
    let table = {};
    for (const [colIndex, column] of this.columns.entries()) {
      for (const [rowIndex, row] of this.rows.entries()) {
        table[`${colIndex}:${rowIndex}`] = row[column.name];
      }
    }
    return table;
  }

  createDisplayObject(display?: Display) {
    let defaultDisplay: Display["default"] = Object.assign(
      {},
      { modified: false }
    );

    if (display?.hasOwnProperty("0:0")) {
      return display;
    } else if (display?.hasOwnProperty("default")) {
      defaultDisplay = display.default;
    }

    // TODO: (typing) is this type correct for the parent set?
    let parents = new Set<string | number>();
    for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
      let row = this.rows[rowIndex];
      if (row.parent) {
        parents.add(row.parent);
      }

      // TODO: (typing) is defaultDisplay an object or array?
      defaultDisplay[rowIndex] = {
        childrenOpen: false,
        indent: row.indent || null,
        isParent: parents.has(rowIndex),
        isRoot: !Boolean(row.parent),
        modified: false,
        open: !Boolean(row.parent),
        parent: row.parent,
      };
    }

    return reactive(defaultDisplay);
  }

  get zeroColumn() {
    return this.config.numberedRows || this.config.treeView;
  }

  get numberedRowWidth() {
    return computed(() => {
      return String(Math.ceil(this.rows.length / 100) + 1) + "ch";
    });
  }

  cellData(colIndex: number, rowIndex: number) {
    return this.table[`${colIndex}:${rowIndex}`];
  }

  setCellData(rowIndex: number, colIndex: number, value: any) {
    if (this.table[`${colIndex}:${rowIndex}`] !== value) {
      this.display[`${colIndex}:${rowIndex}`].modified = true;
    }
    this.table[`${colIndex}:${rowIndex}`] = value;
    return this.table[`${colIndex}:${rowIndex}`];
  }

  toggleRowExpand(rowIndex: number) {
    if (!this.config.treeView) {
      return;
    }

    this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen;
    for (let index = this.rows.length - 1; index >= 0; index--) {
      if (this.display[index].parent === rowIndex) {
        this.display[index].open = !this.display[index].open;
        if (this.display[index].childrenOpen) {
          this.toggleRowExpand(index);
        }
      }
    }
  }
}
