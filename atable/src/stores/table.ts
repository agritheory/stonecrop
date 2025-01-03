import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTableStore = defineStore('table', () => {
  const tables = ref<Record<string, any>>({})

  const getTable = (tableId: string) => {
    if (!tables.value[tableId]) {
      tables.value[tableId] = {
        columns: [],
        rows: [],
        config: {},
        display: [],
        modal: { visible: false },
      }
    }
    return tables.value[tableId]
  }

  const setTableData = (tableId: string, columns: any[], rows: any[], config: any) => {
    const table = getTable(tableId)
    table.columns = columns
    table.rows = rows
    table.config = config
    table.display = rows.map(() => ({ expanded: false, indent: 0 }))
  }

  const getCellData = (tableId: string, colIndex: number, rowIndex: number) => {
    const table = getTable(tableId)
    return table.rows[rowIndex][table.columns[colIndex].name]
  }

  const setCellData = (tableId: string, colIndex: number, rowIndex: number, value: any) => {
    const table = getTable(tableId)
    table.rows[rowIndex][table.columns[colIndex].name] = value
  }

  const getCellDisplayValue = (tableId: string, colIndex: number, rowIndex: number) => {
    const table = getTable(tableId)
    const column = table.columns[colIndex]
    const value = getCellData(tableId, colIndex, rowIndex)
    return column.format ? column.format(value) : value
  }

  const getFormattedValue = (tableId: string, colIndex: number, rowIndex: number, value: any) => {
    const table = getTable(tableId)
    const column = table.columns[colIndex]
    return column.format ? column.format(value) : value
  }

  const getIndent = (tableId: string, colIndex: number, indent: number) => {
    const table = getTable(tableId)
    return `${indent * 2}ch`
  }

  const toggleRowExpand = (tableId: string, rowIndex: number) => {
    const table = getTable(tableId)
    table.display[rowIndex].expanded = !table.display[rowIndex].expanded
  }

  const isRowVisible = (tableId: string, rowIndex: number) => {
    const table = getTable(tableId)
    return table.display[rowIndex].expanded
  }

  const getRowExpandSymbol = (tableId: string, rowIndex: number) => {
    const table = getTable(tableId)
    return table.display[rowIndex].expanded ? '▼' : '►'
  }

  const closeModal = (tableId: string) => {
    const table = getTable(tableId)
    table.modal.visible = false
  }

  return {
    tables,
    getTable,
    setTableData,
    getCellData,
    setCellData,
    getCellDisplayValue,
    getFormattedValue,
    getIndent,
    toggleRowExpand,
    isRowVisible,
    getRowExpandSymbol,
    closeModal,
  }
})
