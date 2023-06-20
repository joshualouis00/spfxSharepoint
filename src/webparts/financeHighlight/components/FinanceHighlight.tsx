/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { IFinanceHighlightProps } from "./IFinanceHighlightProps";
import { Grid, Container, FormControl, Box, CardContent, Card, Typography } from "@mui/material";
import { getSP } from "../services/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import { DataChartInterfaces } from "../interfaces/ChartInterfaces";
import { Placeholder, WebPartTitle } from "@pnp/spfx-controls-react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import HorizontalScroll from 'react-horizontal-scrolling'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import './style.css';

import { ViewHighlight } from "../interfaces/interfaces";

const FinanceHighlight = (props: IFinanceHighlightProps) => {

  const _sp: SPFI = getSP(props.context);
  const list = _sp.web.lists.getById(props.listID).items();

  let FilterType;
  let FilterPeriod;

  const [dataList, setDataList] = React.useState<ViewHighlight[]>([]);
  const [dataFilter, setDataFilter] = React.useState<string>("");
  const [dataFilterPeriod, setDataFilterPeriod] = React.useState<string>("");

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setDataFilter(newValue);
  };

  const handleChangePeriod = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setDataFilterPeriod(newValue);
  };

  const getDataList = async () => {
    console.log("Sharepoint List : ", _sp);
    console.log("Sharepoint Data List : ", list);

    setDataList(
      (await list).map((item) => {
        const itemList = [
          {
            name: item.Kategori,
            xValue: 'Realisasi ' + item.PeriodeBulan + " " + item.PeriodeTahun + ' vs RKAP '
                    + item.PeriodeBulan + " " + item.PeriodeTahun ,
            valueItem1: parseFloat(item.ValueRealisasiPeriodeCurrent.replace(',', '.')), //angka Realisasi Bulan
            rkap: parseFloat(item.RKAPPeriodeCurrent.replace(',', '.')), //angka RKAP
            
            // Jan 23 :
            blnThn:item.PeriodeBulan + ' ' + item.PeriodeTahun +' : ' +
              parseFloat(item.ValueRealisasiPeriodeCurrent.replace(',','.')),
            // RKAP 23:
            rkapThn: 'RKAP' + ' ' + item.PeriodeTahun +' : '
                    + parseFloat(item.RKAPPeriodeCurrent.replace(',','.')),
            // Jan 22:
            blnPrevThn: item.PeriodeBulan + ' ' + item.PreviousPeriodeTahun
                    +' : '+  parseFloat(item.ValueRealisasiPeriodePrevious.replace(',','.')),
            // RKAP FY 23
            rkapFYThn:  'RKAP FY ' + item.PeriodeTahun +' : '
                    + parseFloat(item.RKAPFYPeriodeCurrent.replace(',','.')),
            // vs RKAP = Real Thp
            // Math.ceil((item.ValueRealisasiPeriodeCurrent / item.RKAPFYPeriodeCurrent) * 100) + '%'
            vsRKAP: item.vsRKAP,
            // YOY = Year on Year
            // Math.ceil((item.ValueRealisasiPeriodeCurrent / item.ValueRealisasiPeriodePrevious) * 100) + '%'
            yoy: item.YOY
          },
          {
            //name: item.Kategori,
            xValue: 'Realisasi ' + item.PeriodeBulan + " " + item.PeriodeTahun
                        +' vs RKAP FY' + item.PeriodeTahun,
            valueItem2: parseFloat(item.ValueRealisasiPeriodeCurrent.replace(',','.')), //angka Realisasi Bulan
            rkapFullYear: parseFloat(item.RKAPFYPeriodeCurrent.replace(',','.')), //angka RKAP Full Year
          },
          {
            //name: item.Kategori,
            xValue: 'Realisasi ' + item.PeriodeBulan + ' ' + item.PeriodeTahun +
                        ' vs Realisasi ' + item.PeriodeBulan + ' ' + item.PreviousPeriodeTahun,
            valueItem3: parseFloat(item.ValueRealisasiPeriodeCurrent.replace(',','.')), //angka Realisasi Bulan
            preValue: parseFloat(item.ValueRealisasiPeriodePrevious.replace(',','.')),
          },
        ];
        console.log("Object Data BarChart: ", itemList);
        return {
          Title: item.Title,
          Kategori: item.Kategori,
          Value: item.ValueRealisasiPeriodeCurrent,
          Period: item.PeriodeBulan + "-" + item.PeriodeTahun,
          FinData: itemList,
        };
      })
    );
  };

  React.useEffect(() => {
    if (props.listID && props.listID !== "") {
      getDataList();
    }
  }, [props]);

  FilterType = (data: ViewHighlight[]) => {
    const unique = data
      .map((x) => x.Title)
      .filter((val, index, valArr) => valArr.indexOf(val) === index);
    return unique;
  };
  console.log("FilterType nya :",FilterType)

  FilterPeriod = (data: ViewHighlight[]) => {
    const unique = data
      .map((x) => x.Period)
      .filter((val, index, valArr) => valArr.indexOf(val) === index);
    return unique;
  };
  console.log("FilterPeriod nya :",FilterPeriod)

  return (
    <>
      {
      props.listID ? (
        <Container>
          <Grid container spacing={2}>
            <Grid container sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <WebPartTitle
                  displayMode={props.displayMode}
                  title={props.title}
                  updateProperty={props.onTitleUpdate}
                  className="webpart-title"
                />
              </Grid>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <Select
                      onChange={handleChange}
                      placeholder="Select by Category : "
                    >
                      {FilterType(dataList).map(
                        (item: string, index: number) => {
                          console.log("Itemnya : ", item);
                          return (
                            <Option value={item} key={index}>
                              {item}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <Select
                      onChange={handleChangePeriod}
                      value={dataFilterPeriod}
                      placeholder="Select by Period : "
                    >
                      {FilterPeriod(dataList).map(
                        (item: string, index: number) => {
                          console.log("Itemnya : ", item);
                          return (
                            <Option value={item} key={index}>
                              {item}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
                <Grid container item xs={12} sx={{mt: 1}} spacing={1}>
                {dataList
                  .filter(
                    (val) =>
                      val.Title === dataFilter &&
                      val.Period === dataFilterPeriod
                  )
                  .map((item: ViewHighlight, index: number) => {
                    console.log("Object FinDatanya : ", item);
                    return (
                          <Grid item xs={4} sx={{maxHeight: 300, mb: 25}}>
                       <Card sx={{ borderRadius: 0, border: 'none', mt:5}}>
                      <CardContent sx={{ bgcolor: '#f7f7f7'}}> 
                            <Typography sx={{fontSize: 12,fontWeight: 500, textAlign: "center"}}>
                              <strong> {(item.FinData[0] as any).name} </strong>
                            </Typography>
                            <br />
                            <Typography sx={{fontSize: 12, textAlign: "left"}}>{(item.FinData[0] as any).blnThn}</Typography>
                            <Typography sx={{fontSize: 12, textAlign: "left"}}>{(item.FinData[0] as any).rkapThn}</Typography>
                            <Typography sx={{fontSize: 12, textAlign: "left"}}>{(item.FinData[0] as any).blnPrevThn}</Typography>
                            <Typography sx={{fontSize: 12, textAlign: "left"}}>{(item.FinData[0] as any).rkapFYThn}</Typography>
                        <Grid container spacing={2} sx={{textAlign: "left"}} alignItems={"left"}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                color: parseInt((item.FinData[0] as any).vsRKAP) < 0 ? '#ff0f00' : '#1de800',
                                fontSize: 11,
                                marginTop: '5px'
                              }}
                            >
                              <strong>vs RKAP</strong>
                              <br /> 
                            </Typography>
                            <Typography
                              sx={{color: parseInt((item.FinData[0] as any).vsRKAP) < 0 
                                   ? '#ff0f00' //merah jika hasilnya minus
                                   : '#1de800', //hijau jika hasilnya normal
                                   fontSize: 11
                                  }}
                            >
                              <strong>
                                {(item.FinData[0] as any).vsRKAP}
                              </strong>
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                color: parseInt((item.FinData[0] as any).yoy) < 0 ? '#ff0f00' : '#1de800',
                                fontSize: 11,
                                marginTop: '5px',
                              }}
                            >
                            <strong>YOY</strong>
                            <br /> 
                            </Typography>
                            <Typography
                              sx={{color: parseInt((item.FinData[0] as any).yoy) < 0 
                                   ? '#ff0f00' //merah jika hasilnya minus
                                   : '#1de800', //hijau jika hasilnya normal
                                   fontSize: 11
                                  }}
                            >
                            <strong>
                              {(item.FinData[0] as any).yoy}
                            </strong>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                        <DataChartInterfaces
                          key={index}
                          FinData={item.FinData}
                          // FinRKAP_FY={item.FinRKAP_FY}
                          // FinRealisasi={item.FinRealisasi}
                          Title={item.Title}
                          Kategori={item.Kategori}
                          Value={item.Value}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Placeholder
          iconName="Edit"
          iconText="Finance Highlight - Sharepoint Tugu"
          description="Please configure your webpart"
          buttonLabel="Configure"
          onConfigure={() => props.context.propertyPane.open()}
        />
      )}
    </>
  );
};
export default FinanceHighlight;
