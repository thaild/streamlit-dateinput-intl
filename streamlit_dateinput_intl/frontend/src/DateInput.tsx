import React, { memo, useCallback, useMemo, useState } from "react"
import { DENSITY, Datepicker as UIDatePicker } from 'baseui/datepicker';
import { useIntlLocale } from "./useIntlLocale";
import { parseISO, isValid, format } from 'date-fns';
import moment from "moment"
import { PLACEMENT } from "baseui/popover"
import { SIZE } from "baseui/input";
import "./DateInput.css";
export interface DateInputStateShape {
    value: string | null;
    [key: string]: unknown;
}

export interface DateInputDataShape {
    value?: string | null;
    min?: string | null;
    max?: string | null;
    format?: string;
    locale?: string;
    disabled?: boolean;
    width?: string;
    clearable?: boolean;
    onChange?: (date: string | null) => void;
    key?: string;
}

type DateInputProps = {
    value: string | null;
    min: string | null;
    max: string | null;
    format: string;
    locale: string;
    disabled: boolean;
    width: string;
    clearable: boolean;
    onChange: (date: string | null) => void;
    on_change?: (date: string | null) => void; // Legacy prop name support
};

// Date format for communication (protobuf) support (moment.js format)
const DATE_FORMAT = "YYYY/MM/DD"
// Date format for date-fns (converted from moment.js format)
const DATE_FORMAT_DATE_FNS = "yyyy/MM/dd"

/** Convert an array of strings to an array of dates. */
function stringsToDates(strings: string[]): Date[] {
    return strings.map(val => new Date(val))
}

const HEADER_BG_COLOR = "rgb(240, 242, 246)"
const DATE_SELECTED_COLOR = "rgb(255, 75, 75)"

const DateInput: React.FC<DateInputProps> = (props: DateInputProps) => {
    const { value, min, max, format: formatStr, locale, disabled, clearable, onChange } = props;
    const loadedLocale = useIntlLocale(locale || 'en-US')
    const [isEmpty, setIsEmpty] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Parse initial value
    const initialDate = useMemo(() => {
        if (!value) return null;
        try {
            const parsed = parseISO(value);
            return isValid(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }, [value]);

    const minDate = useMemo(() => {
        if (!min) return undefined;
        const parsed = moment(min, DATE_FORMAT);
        if (!parsed.isValid()) return undefined;
        return parsed.toDate();
    }, [min])

    const maxDate = useMemo(() => {
        if (!max) return undefined;
        const parsed = moment(max, DATE_FORMAT);
        if (!parsed.isValid()) return undefined;
        return parsed.toDate();
    }, [max])

    // Convert format string from Python format to date-fns format
    const dateFormat = useMemo(() => {
        if (!formatStr) return DATE_FORMAT_DATE_FNS;
        // Convert common Python format strings to date-fns format
        // YYYY -> yyyy, YY -> yy, DD -> dd, D -> d
        return formatStr.replaceAll("YYYY", "yyyy").replaceAll("YY", "yy").replaceAll("DD", "dd").replaceAll("D", "d");
    }, [formatStr]);

    const handleChange = (params: { date: Date | Date[] | (Date | null | undefined)[] | null | undefined }) => {
        setError(null)
        const { date } = params;
        // Handle single date (not array)
        if (date && !Array.isArray(date)) {
            onChange(format(date, dateFormat))
        } else if (Array.isArray(date) && date.length > 0) {
            // Handle array case - take the first valid date
            const validDate = date.find(d => d instanceof Date);
            if (validDate) {
                onChange(format(validDate, dateFormat))
            } else {
                onChange(null)
            }
        } else {
            onChange(null)
        }
    };

    const handleClose = useCallback((): void => {
        if (!isEmpty) return

        const newValue = stringsToDates([value || ''])
        setIsEmpty(!newValue)
    }, [isEmpty, value])

    return (
        <div className="stDateInputIntl" data-testid="stDateInputIntl">
            <UIDatePicker
                size={SIZE.large}
                locale={loadedLocale}
                density={DENSITY.high}
                formatString={dateFormat}
                placeholder={formatStr}
                disabled={disabled}
                onChange={handleChange}
                onClose={handleClose}
                overrides={{
                    Root: {
                        style: () => ({
                            padding: "0px",
                        }),
                    },
                    CalendarHeader: {
                        style: () => ({
                            backgroundColor: HEADER_BG_COLOR,
                            borderTopRightRadius: '0.5rem',
                            borderTopLeftRadius: '0.5rem',
                        }),
                    },
                    CalendarContainer: {
                        style: () => ({
                            borderBottomRightRadius: '0.5rem',
                            borderBottomLeftRadius: '0.5rem',
                        }),
                    },
                    Popover: {
                        props: {
                            placement: PLACEMENT.bottomLeft,
                            overrides: {
                                Body: {
                                    style: {
                                        marginTop: '1px',
                                    },
                                },
                            },
                        },
                    },
                    Week: {
                        style: {
                            fontSize: '1rem',
                        },
                    },
                    Day: {
                        style: ({
                            // Due to a bug in BaseWeb, where the range selection defaults to mono300 and can't be changed, we need to override the background colors for all these shared props:
                            // $pseudoHighlighted: Styles the range selection when you click an initial date, and hover over the end one, but NOT click it.
                            // $pseudoSelected: Styles when a range was selected, click outide, and click the calendar again.
                            // $selected: Styles the background below the red circle from the start and end dates.
                            // $isHovered: Styles the background below the end date when hovered.
                            $theme,
                            $selected,
                            $isHovered,
                            $isHighlighted,
                        }) => ({
                            // fontSize: '1rem',
                            lineHeight: '1.6',
                            width: '42px',
                            height: '40px',

                            // borderColor: $selected
                            //     ? DATE_SELECTED_COLOR
                            //     : $isHovered || $isHighlighted
                            //         ? DATE_SELECTED_COLOR
                            //         : 'transparent',

                            "::before": {
                                width: '42px',
                                height: '42px',
                                backgroundColor:
                                    $selected
                                        ? DATE_SELECTED_COLOR
                                        : 'transparent',
                            },

                            "::after": {
                                width: '42px',
                                height: '42px',
                                left: '2px',
                                top: '-1px',
                                borderColor: $isHovered || $isHighlighted ? DATE_SELECTED_COLOR : 'transparent',
                            },
                            //Apply background color only when hovering over a date in the range in light theme
                            // ...($isHovered &&
                            //     !$selected
                            //     ? {
                            //         borderColor: DATE_SELECTED_COLOR,
                            //     }
                            //     : {  }),
                        }),
                    },
                    PrevButton: {
                        style: () => ({
                            // Align icon to the center of the button.
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // Remove primary-color click effect.
                            ":active": {
                                backgroundColor: 'transparent',
                            },
                            ":focus": {
                                backgroundColor: 'transparent',
                                outline: 0,
                            },
                        }),
                    },
                    NextButton: {
                        style: {
                            // Align icon to the center of the button.
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // Remove primary-color click effect.
                            ":active": {
                                backgroundColor: 'transparent',
                            },
                            ":focus": {
                                backgroundColor: 'transparent',
                                outline: 0,
                            },
                        },
                    },
                    Input: {
                        style: ({ $theme }) => ({
                            backgroundColor: 'red',
                            padding: '15px',
                        }),
                        props: {
                            overrides: {
                                EndEnhancer: {
                                    style: {
                                        // Match text color with st.error in light and dark mode
                                        color: '#b00020',
                                        backgroundColor: 'transparent',
                                    },
                                },
                                Root: {
                                    style: () => {
                                        const borderColor = 'red'
                                        return {
                                            // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                                            borderLeftWidth: '1px',
                                            borderRightWidth: '1px',
                                            borderTopWidth: '1px',
                                            borderBottomWidth: '1px',
                                            padding: '14px',
                                            maxWidth: '100%',
                                            lineHeight: '1.5',

                                            borderTopColor: borderColor,
                                            borderRightColor: borderColor,
                                            borderBottomColor: borderColor,
                                            borderLeftColor: borderColor,

                                            // Baseweb has an error prop for the input, but its coloring doesn't reconcile
                                            // with our dark theme - we handle error state coloring manually here
                                            ...(error && {
                                                backgroundColor: '#b00020',
                                            }),
                                        }
                                    },
                                },
                                InputContainer: {
                                    style: {
                                        // Explicitly specified so error background renders correctly
                                        backgroundColor: "red",
                                        padding: '0.5rem',
                                        maxWidth: '100%',
                                        lineHeight: '1.5',
                                    },
                                },
                                Input: {
                                    style: {
                                        backgroundColor: "red",
                                        fontWeight: 'normal',
                                        // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                                        lineHeight: '1.5',
                                        padding: '0.5rem',
                                        maxWidth: '100%',

                                        "::placeholder": {
                                            color: '#666666',
                                        },

                                        // Change input value text color in error state - matches st.error in light and dark mode
                                        ...(error && {
                                            color: '#b00020',
                                        }),
                                    },
                                    props: {
                                        "data-testid": "stDateInputField",
                                    },
                                },
                            },
                        },
                    }
                }}
                value={initialDate}
                minDate={minDate}
                maxDate={maxDate}
                clearable={false}
            />
        </div>
    )
}

export default memo(DateInput)