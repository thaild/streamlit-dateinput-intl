# streamlit-dateinput-intl

DateInput internationalization

## Installation instructions

```sh
uv pip install streamlit-dateinput-intl
```

## Usage instructions

```python
import streamlit as st

from streamlit_dateinput_intl import streamlit_dateinput_intl

selected_date = streamlit_dateinput_intl(
   value="today",
   min=date.today() - timedelta(days=30),
   max=date.today() + timedelta(days=30),
   key="date_input_full",
   format="YYYY/MM/DD",
   disabled=False,
   width="stretch",
   locale="ja"
)

st.write(selected_date)
```
