import { ArrowRight, ChartColumn, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  filterFields,
  incidentRows,
  pagination,
  tableColumns,
  type FilterField,
} from '@/lib/phase-one-data'

/** 筛选控件外框样式（输入框 / 下拉框 / 时间区间共用） */
const fieldBox =
  'flex h-[42px] items-center rounded-[4px] border border-[#D9DDE5] bg-white text-[15px] text-[#3A4256]'

function FilterControl({ field }: { field: FilterField }) {
  if (field.kind === 'range') {
    return (
      <div className={cn(fieldBox, 'px-3')} style={{ width: field.width }}>
        <span className="text-[#A8AEBB]">开始时间</span>
        <ArrowRight className="mx-2 size-3.5 shrink-0 text-[#A8AEBB]" strokeWidth={2} />
        <span className="text-[#A8AEBB]">结束时间</span>
      </div>
    )
  }

  return (
    <div className={cn(fieldBox, 'relative px-3')} style={{ width: field.width }}>
      <span className="truncate text-[#A8AEBB]">{field.placeholder}</span>
      {field.kind === 'select' && (
        <ChevronDown
          className="ml-auto size-[15px] shrink-0 text-[#98A0AE]"
          strokeWidth={2}
        />
      )}
    </div>
  )
}

function PaginationButton({
  children,
  active,
  disabled,
  className,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-[4px] px-2 text-[15px]',
        active ? 'bg-[#367AF0] text-white' : 'bg-[#F0F2F7] text-[#3A4256]',
        disabled && 'text-[#C0C4CC]',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** 主体内容卡片：标题 + 筛选条 + 表格 + 分页（参考图 axn2.png 右侧内容区） */
export function IncidentList() {
  return (
    <section className="flex min-h-full flex-col rounded-[4px] bg-white px-4 pt-4 pb-3">
      {/* 标题 */}
      <h1 className="flex items-center gap-2 text-[17px] font-semibold text-[#2F3A4F]">
        <ChartColumn className="size-[19px] text-[#2F7BFF]" strokeWidth={2.2} />
        抢险事件列表
      </h1>

      {/* 筛选条 */}
      <div className="mt-[18px] flex flex-wrap items-center gap-x-7 gap-y-3">
        {filterFields.map((field) => (
          <div key={field.label} className="flex items-center gap-2.5">
            <span className="text-[15px] whitespace-nowrap text-[#3A4256]">
              {field.label}：
            </span>
            <FilterControl field={field} />
          </div>
        ))}
      </div>

      {/* 表格 */}
      <table className="mt-[18px] w-full table-fixed border-collapse">
        <colgroup>
          {tableColumns.map((col) => (
            <col key={col.key} style={{ width: `${col.width}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-[#EBEFF8] text-[15px] font-semibold text-[#3A4256]">
            {tableColumns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'h-[50px] px-3 font-semibold',
                  col.align === 'center' ? 'text-center' : 'text-left',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {incidentRows.map((row) => (
            <tr
              key={row.no}
              className={cn(
                'h-[54px] text-[15px] text-[#3A4256]',
                row.no % 2 === 0 ? 'bg-[#EBEFF8]' : 'bg-white',
              )}
            >
              <td className="px-3 text-center">{row.no}</td>
              <td className="truncate px-3">{row.title}</td>
              <td className="truncate px-3">{row.category}</td>
              <td className="truncate px-3">{row.caller}</td>
              <td className="truncate px-3">{row.updatedAt}</td>
              <td className="truncate px-3">{row.sender}</td>
              <td className="truncate px-3">{row.reporter}</td>
              <td className="truncate px-3">{row.infoType}</td>
              <td className="px-3">
                <div className="flex items-center gap-2">
                  {row.actions.map((action) => (
                    <span
                      key={action}
                      className="flex h-[30px] items-center justify-center rounded-[4px] border border-[#4A8CFF] bg-white px-2.5 text-[15px] whitespace-nowrap text-[#2F7BFF]"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页 */}
      <div className="mt-auto flex items-center justify-end gap-2.5 pt-4 text-[15px] text-[#3A4256]">
        <span className="mr-1">共 {pagination.total} 条</span>
        <PaginationButton disabled className="px-3">
          上一页
        </PaginationButton>
        {pagination.pages.map((page) =>
          page === '...' ? (
            <span key={page} className="px-1 text-[#8A93A3]">
              ...
            </span>
          ) : (
            <PaginationButton key={page} active={page === String(pagination.current)}>
              {page}
            </PaginationButton>
          ),
        )}
        <PaginationButton className="px-3">下一页</PaginationButton>

        <span className="ml-1 flex h-8 w-[100px] items-center justify-center gap-2 rounded-[4px] border border-[#D9DDE5] bg-white px-2.5">
          {pagination.pageSize} / 页
          <ChevronDown className="size-[15px] text-[#98A0AE]" strokeWidth={2} />
        </span>
        <span>到</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#D9DDE5] bg-white">
          {pagination.current}
        </span>
        <span>页</span>
      </div>
    </section>
  )
}
