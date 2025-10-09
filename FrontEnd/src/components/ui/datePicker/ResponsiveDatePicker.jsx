import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ptBR } from "@mui/x-date-pickers/locales";

export default function ResponsiveDatePickers({ date, onChange }) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DemoContainer components={["DatePicker"]}>
        <DemoItem label={""}>
          <DatePicker
            defaultValue={dayjs(date)}
            format="DD/MM/YYYY"
            onChange={onChange}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
