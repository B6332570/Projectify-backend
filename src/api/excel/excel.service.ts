import { Injectable } from '@nestjs/common';
import * as xl from 'excel4node';
import { Response } from 'express';
@Injectable()
export class ExcelService {
  async exportExcel(res: Response, headers: string[], data: any[]) {
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');
    var ws2 = wb.addWorksheet('Sheet 2');
    const styleHeader = this.styleHeader(wb);
    this.renderHeader(headers, ws, styleHeader);

    const styleData = this.styleData(wb);
    this.renderData(ws, styleData, data);

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    wb.write('Excel.xlsx', res);
  }
  styleHeader(wb: any) {
    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });
    return style;
  }

  styleData(wb: any) {
    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });
    return style;
  }

  renderHeader(headers: string[], ws: any, style: any) {
    for (const [i, header] of headers.entries()) {
      ws.cell(1, i + 1)
        .string(header)
        .style(style);
    }
  }

  private renderData = (ws: any, dataStyle: any, result: any) => {
    let row = 2;
    for (const data of result) {
      let isCount = true;
      let newRaw = row;
      for (let [index, key] of Object.keys(data).entries()) {
        if (!Array.isArray(data[key])) {
          ws.cell(row, index + 1)
            .string(`${data[key] || ''}`)
            .style(dataStyle);
        } else if (Array.isArray(data[key]) && data[key].length > 0) {
          isCount = false;
          let childIndex = index + 1;
          let childRow = row;
          let new2Raw = row;
          for (const cItem of data[key]) {
            let isChildCount = true;
            for (let [cIndex, cKey] of Object.keys(cItem).entries()) {
              const itemChild = cItem[cKey];
              if (!Array.isArray(itemChild)) {
                ws.cell(childRow, cIndex + childIndex)
                  .string(`${itemChild || ''}`)
                  .style(dataStyle);
              } else if (Array.isArray(itemChild) && itemChild.length > 0) {
                isChildCount = false;
                let child2Index = childIndex + 1;
                let child2Row = childRow;
                let new3Raw = childRow;
                for (const c2Item of itemChild) {
                  let isChild2Count = true;
                  for (let [c2Index, c2Key] of Object.keys(c2Item).entries()) {
                    const itemChild2 = c2Item[c2Key];
                    if (!Array.isArray(itemChild2)) {
                      ws.cell(child2Row, c2Index + child2Index)
                        .string(`${itemChild2 || ''}`)
                        .style(dataStyle);
                    } else if (
                      Array.isArray(itemChild2) &&
                      itemChild2.length > 0
                    ) {
                      isChild2Count = false;
                      let child3Index = child2Index + 1;
                      let child3Row = child2Row;
                      let new4Raw = child2Row;
                      for (const c3Item of itemChild2) {
                        let isChild3Count = true;
                        for (let [c3Index, c3Key] of Object.keys(
                          c3Item,
                        ).entries()) {
                          const itemChild3 = c3Item[c3Key];
                          if (!Array.isArray(itemChild3)) {
                            ws.cell(child3Row, c3Index + child3Index)
                              .string(`${itemChild3 || ''}`)
                              .style(dataStyle);
                          } else if (
                            Array.isArray(itemChild3) &&
                            itemChild3.length > 0
                          ) {
                            isChild3Count = false;
                            let child4Index = child3Index + 1;
                            let child4Row = child3Row;
                            for (const c4Item of itemChild3) {
                              for (let [c4Index, c4Key] of Object.keys(
                                c4Item,
                              ).entries()) {
                                const itemChild4 = c4Item[c4Key];
                                if (!Array.isArray(itemChild4)) {
                                  ws.cell(child4Row, c4Index + child4Index)
                                    .string(`${itemChild4 || ''}`)
                                    .style(dataStyle);
                                }
                                child4Row++;
                              }
                            }
                            child3Row = child4Row;
                          }
                        }
                        if (isChild3Count) {
                          child3Row++;
                        }
                        new4Raw = child3Row;
                      }
                      child2Row = new4Raw;
                    }
                  }
                  if (isChild2Count) {
                    child2Row++;
                  }
                  new3Raw = child2Row;
                }
                childRow = new3Raw;
              }
            }
            if (isChildCount) {
              childRow++;
            }
            new2Raw = childRow;
          }
          newRaw = new2Raw;
        }
      }
      row = newRaw;
      if (isCount) {
        row++;
      }
    }
  };
}
