import * as React from 'react';
import * as moment from 'moment';
import { polyfill } from 'react-lifecycles-compat';
import Calendar from 'rc-calendar';
import RcDatePicker from 'rc-calendar/lib/Picker';
import classNames from 'classnames';
import Icon from '../icon';
import interopDefault from '../_util/interopDefault';

function formatValue(value: moment.Moment | null, format: string): string {
  return (value && value.format(format)) || '';
}

interface WeekPickerState {
  open: boolean;
  value: moment.Moment | null;
}

class WeekPicker extends React.Component<any, WeekPickerState> {
  static defaultProps = {
    format: 'gggg-wo',
    allowClear: true,
  };

  static getDerivedStateFromProps(nextProps: any) {
    if ('value' in nextProps || 'open' in nextProps) {
      const state = {} as WeekPickerState;
      if ('value' in nextProps) {
        state.value = nextProps.value;
      }
      if ('open' in nextProps) {
        state.open = nextProps.open;
      }
      return state;
    }
    return null;
  }

  private input: any;

  constructor(props: any) {
    super(props);
    const value = props.value || props.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error(
        'The value/defaultValue of DatePicker or MonthPicker must be ' +
          'a moment object after `antd@2.0`, see: https://u.ant.design/date-picker-value',
      );
    }
    this.state = {
      value,
      open: props.open,
    };
  }

  weekDateRender = (current: any) => {
    const selectedValue = this.state.value;
    const { prefixCls, dateRender } = this.props;
    const dateNode = dateRender ? dateRender(current) : current.date();
    if (
      selectedValue &&
      current.year() === selectedValue.year() &&
      current.week() === selectedValue.week()
    ) {
      return (
        <div className={`${prefixCls}-selected-day`}>
          <div className={`${prefixCls}-date`}>{dateNode}</div>
        </div>
      );
    }
    return <div className={`${prefixCls}-date`}>{dateNode}</div>;
  };

  handleChange = (value: moment.Moment | null) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    this.props.onChange(value, formatValue(value, this.props.format));
  };

  handleOpenChange = (open: boolean) => {
    const { onOpenChange } = this.props;
    if (!('open' in this.props)) {
      this.setState({ open });
    }

    if (onOpenChange) {
      onOpenChange(open);
    }

    if (!open) {
      this.focus();
    }
  };

  clearSelection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.handleChange(null);
  };

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  saveInput = (node: any) => {
    this.input = node;
  };

  render() {
    const {
      prefixCls,
      className,
      disabled,
      pickerClass,
      popupStyle,
      pickerInputClass,
      format,
      allowClear,
      locale,
      localeCode,
      disabledDate,
      style,
      onFocus,
      onBlur,
      id,
      suffixIcon,
    } = this.props;

    const { open, value: pickerValue } = this.state;
    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    const placeholder =
      'placeholder' in this.props ? this.props.placeholder : locale.lang.placeholder;

    const calendar = (
      <Calendar
        showWeekNumber
        dateRender={this.weekDateRender}
        prefixCls={prefixCls}
        format={format}
        locale={locale.lang}
        showDateInput={false}
        showToday={false}
        disabledDate={disabledDate}
      />
    );
    const clearIcon =
      !disabled && allowClear && this.state.value ? (
        <Icon
          type="close-circle"
          className={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
          theme="filled"
        />
      ) : null;

    const inputIcon = (suffixIcon &&
      (React.isValidElement<{ className?: string }>(suffixIcon) ? (
        React.cloneElement(suffixIcon, {
          className: classNames({
            [suffixIcon.props.className!]: suffixIcon.props.className,
            [`${prefixCls}-picker-icon`]: true,
          }),
        })
      ) : (
        <span className={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
      ))) || <Icon type="calendar" className={`${prefixCls}-picker-icon`} />;

    const input = ({ value }: { value: moment.Moment | undefined }) => (
      <span style={{ display: 'inline-block', width: '100%' }}>
        <input
          ref={this.saveInput}
          disabled={disabled}
          readOnly
          value={(value && value.format(format)) || ''}
          placeholder={placeholder}
          className={pickerInputClass}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {clearIcon}
        {inputIcon}
      </span>
    );
    return (
      <span className={classNames(className, pickerClass)} style={style} id={id}>
        <RcDatePicker
          {...this.props}
          calendar={calendar}
          prefixCls={`${prefixCls}-picker-container`}
          value={pickerValue}
          onChange={this.handleChange}
          open={open}
          onOpenChange={this.handleOpenChange}
          style={popupStyle}
        >
          {input}
        </RcDatePicker>
      </span>
    );
  }
}

polyfill(WeekPicker);

export default WeekPicker;
