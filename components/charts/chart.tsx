import type { ReactNode } from "react";
import { Circle, G, Line, Svg, Text } from "react-native-svg";

type ChartXValue = number | Date | string;

type ChartData = {
  x: ChartXValue;
  y: number;
};

export type ChartPointRenderProps = {
  x: number;
  y: number;
  item: ChartData;
  index: number;
  color?: string;
  chartHeight?: number;
  gridHeight?: number;
  gridLinesCount?: number;
};

export type ChartLineRenderProps = {
  points: { x: number; y: number }[];
  color?: string;
};

export interface ChartProps {
  width?: number;
  height?: number;
  data?: ChartData[];
  renderPoint?: (props: ChartPointRenderProps) => ReactNode;
  renderLine?: (props: ChartLineRenderProps) => ReactNode;
  formatYTick?: (value: number, index: number) => string;
  formatXTick?: (value: number, index: number) => string;
  pointWidth?: number;
  step?: number;
  yMin?: number;
  style?: {
    backgroundColor?: string;
    chartContainer?: { color?: string };
    showGrid?: boolean;
    grid?: {
      color?: string;
      lastValueColor?: string;
      lastIndexColor?: string;
      opacity?: number;
      fontFamily?: string;
      fontSize?: number;
    };
  };
}

const CHART_COLOR = "green";
const DEFAULT_POINT_COLOR = "blue";

const normalize = (
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number,
) => {
  if (sourceMax === sourceMin) {
    return (targetMin + targetMax) / 2;
  }

  return (
    targetMin +
    ((value - sourceMin) / (sourceMax - sourceMin)) * (targetMax - targetMin)
  );
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const isDateLikeString = (value: string) => {
  const asNumber = Number(value);
  const asDate = Date.parse(value);
  return !Number.isFinite(asNumber) && Number.isFinite(asDate);
};

const getYTickStep = (maxValue: number) => {
  const safeMax = Math.max(Math.abs(maxValue), 1e-6);
  const magnitude = Math.pow(10, Math.floor(Math.log10(safeMax)));
  const normalized = safeMax / magnitude;
  if (normalized <= 1) return magnitude * 0.1;
  if (normalized <= 2) return magnitude * 0.2;
  if (normalized <= 5) return magnitude * 0.5;
  return magnitude;
};

const buildYTicks = (minValue: number, maxValue: number, step: number) => {
  if (step <= 0) {
    return [minValue, maxValue];
  }

  const epsilon = step * 1e-6;
  const ticks: number[] = [Number(minValue.toFixed(6))];
  const firstStepTick = Math.ceil((minValue + epsilon) / step) * step;
  const lastStepTick = Math.ceil((maxValue - epsilon) / step) * step;

  for (let tick = firstStepTick; tick <= lastStepTick + epsilon; tick += step) {
    ticks.push(Number(tick.toFixed(6)));
  }

  const uniqueTicks = [...new Set(ticks)].sort((a, b) => a - b);

  return uniqueTicks.length > 0
    ? uniqueTicks
    : [Number(minValue.toFixed(6)), Number(maxValue.toFixed(6))];
};

export default function Chart(props: ChartProps) {
  const data = props.data || [];
  const width = props.width ?? 0;
  const height = props.height ?? 0;

  const leftPadding = 12;
  const rightLabelGap = 6;
  const rightLabelInset = 2;
  const topPadding = 14;
  const labelFontSize = props.style?.grid?.fontSize ?? 10;
  const bottomPadding = Math.max(30, labelFontSize + 26);

  const ySpan = Math.max(height - topPadding - bottomPadding, 1);

  const labelMargin = 4;
  const yLabelHalfHeight = labelFontSize / 2;
  const yLabelMin = yLabelHalfHeight + 1;
  const yLabelMax = height - yLabelHalfHeight - 1;
  const xLabelY = clamp(
    height - labelFontSize / 2 - 4,
    labelFontSize / 2 + 1,
    height - labelFontSize / 2 - 1,
  );
  const edgeAnchorThreshold = 12;

  const hasDateX = data.some((item) => {
    if (item.x instanceof Date) {
      return true;
    }

    if (typeof item.x === "string") {
      return isDateLikeString(item.x);
    }

    return false;
  });

  const toXNumber = (value: ChartXValue) => {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === "number") {
      return value;
    }

    if (hasDateX) {
      const timestamp = Date.parse(value);
      if (Number.isFinite(timestamp)) {
        return timestamp;
      }
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const xValues = data.map((item) => toXNumber(item.x));
  const yValues = data.map((item) => item.y);
  const minY = props.yMin ?? (yValues.length > 0 ? Math.min(...yValues) : 0);
  const maxY = yValues.length > 0 ? Math.max(...yValues) : 0;

  const xTicks = [...new Set(xValues)].sort((a, b) => a - b);
  const yTickStep =
    props.step ?? getYTickStep(Math.max(Math.abs(minY), Math.abs(maxY)));
  const yTicks = buildYTicks(minY, maxY, yTickStep);
  const yDomainMin = yTicks.length > 0 ? yTicks[0] : minY;
  const yDomainMax = yTicks.length > 0 ? yTicks[yTicks.length - 1] : maxY;

  const yTickPrecision =
    yTickStep < 1 ? Math.ceil(Math.abs(Math.log10(yTickStep))) : 0;
  const formatTick = (value: number) => {
    if (yTickPrecision > 0) {
      return value.toFixed(yTickPrecision);
    }

    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  };

  const minYLabelSpacing = labelFontSize + 4;
  const maxYLabels = Math.max(Math.floor(ySpan / minYLabelSpacing), 1);
  const yLabelStep =
    props.step != null ? 1 : Math.max(Math.ceil(yTicks.length / maxYLabels), 1);
  const visibleYTicks = yTicks.filter(
    (_, i) => i % yLabelStep === 0 || i === yTicks.length - 1,
  );
  const visibleYLabels = visibleYTicks.map((value, i) =>
    props.formatYTick ? props.formatYTick(value, i) : formatTick(value),
  );
  const maxYLabelLength = visibleYLabels.reduce(
    (maxLength, label) => Math.max(maxLength, label.length),
    0,
  );
  const estimatedYLabelWidth = Math.ceil(
    maxYLabelLength * labelFontSize * 0.62,
  );
  const rightLabelArea = Math.max(
    estimatedYLabelWidth + rightLabelInset + 2,
    12,
  );
  const plotRight = width - rightLabelArea - rightLabelGap;
  const rightLabelLeft = plotRight + rightLabelGap;
  const rightLabelRight = width - rightLabelInset;
  const xSpan = Math.max(plotRight - leftPadding, 1);
  const xHalfPoint = (props.pointWidth ?? 0) / 2;

  const xTickIndexMap = new Map(xTicks.map((value, index) => [value, index]));

  const formatXTickValue = (value: number) => {
    if (!hasDateX) {
      return formatTick(value);
    }

    return new Date(value).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getScaledX = (value: number) => {
    const xIndex = xTickIndexMap.get(value) ?? 0;
    return normalize(
      xIndex,
      0,
      Math.max(xTicks.length - 1, 1),
      leftPadding + xHalfPoint,
      leftPadding + xSpan - xHalfPoint,
    );
  };

  const getScaledY = (value: number) => {
    return normalize(
      value,
      yDomainMin,
      yDomainMax,
      topPadding + ySpan,
      topPadding,
    );
  };

  const scaledPoints = data.map((item) => ({
    x: getScaledX(toXNumber(item.x)),
    y: getScaledY(item.y),
  }));

  return (
    <Svg
      width={width}
      height={height}
      style={{ backgroundColor: props.style?.backgroundColor ?? "transparent" }}
    >
      {props.renderLine ? (
        <G>
          {props.renderLine({
            points: scaledPoints,
            color: props.style?.chartContainer?.color ?? CHART_COLOR,
          })}
        </G>
      ) : null}

      {props.style?.showGrid &&
        yTicks.map((value, i) => {
          const y = clamp(getScaledY(value), yLabelMin, yLabelMax);

          return (
            <Line
              key={`grid-y-${i}`}
              x1={leftPadding}
              y1={y}
              x2={plotRight}
              y2={y}
              stroke={
                i === yTicks.length - 1
                  ? (props.style?.grid?.lastIndexColor ?? CHART_COLOR)
                  : (props.style?.grid?.color ?? CHART_COLOR)
              }
              strokeOpacity={props.style?.grid?.opacity ?? 1}
              strokeWidth={2}
              strokeDasharray="6 6"
            />
          );
        })}

      {data.map((item, i) => {
        const point = scaledPoints[i];
        const cx = point?.x ?? 0;
        const cy = point?.y ?? 0;

        return (
          <G key={`point-${i}`}>
            {props.renderPoint ? (
              props.renderPoint({
                x: cx,
                y: cy,
                item,
                index: i,
                color: props.style?.chartContainer?.color ?? CHART_COLOR,
                chartHeight: topPadding + ySpan,
                gridHeight: ySpan / Math.max(yTicks.length - 1, 1),
                gridLinesCount: Math.max(yTicks.length - 1, 1),
              })
            ) : (
              <Circle
                cx={cx}
                cy={cy}
                r={4}
                fill={props.style?.chartContainer?.color ?? DEFAULT_POINT_COLOR}
              />
            )}
          </G>
        );
      })}

      {visibleYTicks.map((value, i) => {
        const y = clamp(getScaledY(value), yLabelMin, yLabelMax);
        const label = visibleYLabels[i] ?? formatTick(value);
        const centerRightLabelX = clamp(
          (rightLabelLeft + rightLabelRight) / 2,
          labelMargin,
          width - labelMargin,
        );

        return (
          <Text
            x={centerRightLabelX}
            y={y}
            fontSize={labelFontSize}
            fill={
              i === visibleYTicks.length - 1 &&
              props.style?.grid?.lastValueColor
                ? props.style.grid.lastValueColor
                : (props.style?.grid?.color ?? CHART_COLOR)
            }
            fontFamily={props.style?.grid?.fontFamily ?? "System"}
            textAnchor="middle"
            alignmentBaseline="middle"
            key={`value-${i}`}
          >
            {label}
          </Text>
        );
      })}

      {xTicks.map((value, i) => {
        const x = getScaledX(value);
        const safeX = clamp(x, leftPadding, plotRight);
        const label = props.formatXTick
          ? props.formatXTick(value, i)
          : formatXTickValue(value);
        const xAnchor =
          safeX <= leftPadding + edgeAnchorThreshold
            ? "start"
            : safeX >= plotRight - edgeAnchorThreshold
              ? "end"
              : "middle";

        return (
          <G key={`axis-${i}`}>
            <Text
              x={safeX}
              y={xLabelY}
              fontSize={labelFontSize}
              fill={props.style?.grid?.color ?? CHART_COLOR}
              fontFamily={props.style?.grid?.fontFamily ?? "System"}
              textAnchor={xAnchor}
              alignmentBaseline="middle"
            >
              {label}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}
