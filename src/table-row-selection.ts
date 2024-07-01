const TableRowSelectionDefaultConfig: TableRowSelectionConfig = {
  activeClass: 'table-active',
}

class TableRowSelection {
  public table: Table
  private static instances: Map<Table, TableRowSelection> = new Map()
  private config = TableRowSelectionDefaultConfig
  public onChange?: () => void

  constructor(table: Table, config?: OptionalType<TableRowSelectionConfig>) {
    this.table = table
    this.config = { ...this.config, ...config }
    this.init()
    TableRowSelection.instances.set(table, this)
  }

  private init(): void {
    if (!TableRowSelection.instances.has(this.table)) {
      this.listen()
      TableRowSelection.instances.set(this.table, this)
    }
  }

  private listen() {
    const table = this.table as HTMLTableElement
    table.addEventListener('change', (e) => {
      if ((e.target as any).type === 'checkbox') {
        const input = e.target as HTMLInputElement
        if (input.closest('thead')) {
          this.handleSelectAll(input)
          this.changes()
        }
        if (input.closest('tbody')) {
          this.handleSelectRow(input)
          this.changes()
        }
      }
    })
  }

  private changes() {
    const rows = this.getRows()
    const length = rows.length
    const selected = rows.filter(input => input.checked).length
    const checked = length === selected
    this.table!.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!.checked = checked
    if (this?.onChange) {
      this.onChange()
    }
  }

  private getRows() {
    return Array.from(this.table!.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'))
  }

  private handleSelectAll(input: HTMLInputElement) {
    this.setAll(input.checked)
  }

  private setAll(checked: boolean) {
    this.getRows().forEach((input) => {
      input.checked = checked
      this.handleSelectRow(input)
    })
  }

  private handleSelectRow(input: HTMLInputElement) {
    const tr = input.closest('tr')
    const checked = input.checked

    checked ? tr?.classList.add(this.config!.activeClass) : tr?.classList.remove(this.config!.activeClass)
  }

  static getOrCreateInstance(table: Table): TableRowSelection {
    let instance = TableRowSelection.instances.get(table)
    if (!instance) {
      instance = new TableRowSelection(table)
    }
    return instance
  }

  public getSelected(): string[] {
    return this.getRows().filter(input => input.checked).map(input => input.value)
  }

  private setSelected(value: string | string[], checked = true) {
    const values = Array.isArray(value) ? value : [value]
    this.getRows().filter(input => values.includes(input.value)).forEach((input) => {
      input.checked = checked
      this.handleSelectRow(input)
    })
    this.changes()
  }

  public selectAll(): void {
    this.setAll(true)
    this.changes()
  }

  public unselectAll(): void {
    this.setAll(false)
    this.changes()
  }

  public select(value: string | string[]): void {
    this.setSelected(value, true)
  }

  public unselect(value: string | string[]): void {
    this.setSelected(value, false)
  }
}

export default TableRowSelection

type Table = HTMLTableElement | HTMLElement | null
type OptionalType<T> = {
  [P in keyof T]?: T[P]
}
export interface TableRowSelectionConfig {
  activeClass: string
}
