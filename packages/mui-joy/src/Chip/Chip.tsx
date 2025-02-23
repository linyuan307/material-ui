import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, useButton } from '@mui/base';
import { OverridableComponent } from '@mui/types';
import { unstable_capitalize as capitalize, unstable_useId as useId } from '@mui/utils';
import { useThemeProps } from '../styles';
import styled from '../styles/styled';
import { useColorInversion } from '../styles/ColorInversion';
import chipClasses, { getChipUtilityClass } from './chipClasses';
import { ChipProps, ChipOwnerState, ChipTypeMap } from './ChipProps';
import ChipContext from './ChipContext';
import useSlot from '../utils/useSlot';

const useUtilityClasses = (ownerState: ChipOwnerState) => {
  const { disabled, size, color, clickable, variant, focusVisible } = ownerState;

  const slots = {
    root: [
      'root',
      disabled && 'disabled',
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
      variant && `variant${capitalize(variant)}`,
      clickable && 'clickable',
    ],
    action: ['action', disabled && 'disabled', focusVisible && 'focusVisible'],
    label: ['label', size && `label${capitalize(size)}`],
    startDecorator: ['startDecorator'],
    endDecorator: ['endDecorator'],
  };

  return composeClasses(slots, getChipUtilityClass, {});
};

const ChipRoot = styled('div', {
  name: 'JoyChip',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChipOwnerState }>(({ theme, ownerState }) => {
  return [
    {
      // for controlling chip delete margin offset
      '--Chip-decorator-childOffset':
        'min(calc(var(--Chip-paddingInline) - (var(--_Chip-minHeight) - 2 * var(--variant-borderWidth, 0px) - var(--Chip-decorator-childHeight)) / 2), var(--Chip-paddingInline))',
      '--Chip-decorator-childRadius':
        'max(var(--_Chip-radius) - var(--_Chip-paddingBlock), min(var(--_Chip-paddingBlock) / 2, var(--_Chip-radius) / 2))',
      '--Chip-delete-radius': 'var(--Chip-decorator-childRadius)',
      '--Chip-delete-size': 'var(--Chip-decorator-childHeight)',
      '--Avatar-radius': 'var(--Chip-decorator-childRadius)',
      '--Avatar-size': 'var(--Chip-decorator-childHeight)',
      '--Icon-margin': 'initial', // reset the icon's margin.
      '--internal-action-radius': 'var(--_Chip-radius)', // to be used with Radio or Checkbox
      ...(ownerState.size === 'sm' && {
        '--Chip-gap': '0.25rem',
        '--Chip-paddingInline': '0.5rem',
        '--Chip-decorator-childHeight':
          'calc(min(1.125rem, var(--_Chip-minHeight)) - 2 * var(--variant-borderWidth, 0px))',
        '--Icon-fontSize': 'calc(var(--_Chip-minHeight) / 1.714)', // 0.875rem by default
        '--_Chip-minHeight': 'var(--Chip-minHeight, 1.5rem)',
        fontSize: theme.vars.fontSize.xs,
      }),
      ...(ownerState.size === 'md' && {
        '--Chip-gap': '0.375rem',
        '--Chip-paddingInline': '0.75rem',
        '--Chip-decorator-childHeight': 'min(1.375rem, var(--_Chip-minHeight))',
        '--Icon-fontSize': 'calc(var(--_Chip-minHeight) / 1.778)', // 1.125rem by default
        '--_Chip-minHeight': 'var(--Chip-minHeight, 2rem)',
        fontSize: theme.vars.fontSize.sm,
      }),
      ...(ownerState.size === 'lg' && {
        '--Chip-gap': '0.5rem',
        '--Chip-paddingInline': '1rem',
        '--Chip-decorator-childHeight': 'min(1.75rem, var(--_Chip-minHeight))',
        '--Icon-fontSize': 'calc(var(--_Chip-minHeight) / 2)', // 1.25rem by default
        '--_Chip-minHeight': 'var(--Chip-minHeight, 2.5rem)',
        fontSize: theme.vars.fontSize.md,
      }),
      '--_Chip-radius': 'var(--Chip-radius, 1.5rem)',
      '--_Chip-paddingBlock':
        'max((var(--_Chip-minHeight) - 2 * var(--variant-borderWidth, 0px) - var(--Chip-decorator-childHeight)) / 2, 0px)',
      minHeight: 'var(--_Chip-minHeight)',
      paddingInline: 'var(--Chip-paddingInline)',
      borderRadius: 'var(--_Chip-radius)',
      position: 'relative',
      fontWeight: theme.vars.fontWeight.md,
      fontFamily: theme.vars.fontFamily.body,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      transition:
        'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      textDecoration: 'none',
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      [`&.${chipClasses.disabled}`]: {
        color: theme.variants[`${ownerState.variant!}Disabled`]?.[ownerState.color!]?.color,
      },
    },
    ...(!ownerState.clickable
      ? [
          theme.variants[ownerState.variant!]?.[ownerState.color!],
          {
            [`&.${chipClasses.disabled}`]:
              theme.variants[`${ownerState.variant!}Disabled`]?.[ownerState.color!],
          },
        ]
      : [
          {
            '--variant-borderWidth': '0px',
            color: theme.variants[ownerState.variant!]?.[ownerState.color!]?.color,
          },
        ]),
  ];
});

const ChipLabel = styled('span', {
  name: 'JoyChip',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})<{ ownerState: ChipOwnerState }>(({ ownerState }) => ({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  order: 1,
  minInlineSize: 0,
  flexGrow: 1,
  ...(ownerState.clickable && {
    zIndex: 1,
    pointerEvents: 'none',
  }),
}));

const ChipAction = styled('button', {
  name: 'JoyChip',
  slot: 'Action',
  overridesResolver: (props, styles) => styles.action,
})<{ ownerState: ChipOwnerState }>(({ theme, ownerState }) => [
  {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    border: 'none',
    cursor: 'pointer',
    padding: 'initial',
    margin: 'initial',
    backgroundColor: 'initial',
    textDecoration: 'none',
    borderRadius: 'inherit',
    transition:
      'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    [theme.focus.selector]: theme.focus.default,
  },
  theme.variants[ownerState.variant!]?.[ownerState.color!],
  { '&:hover': theme.variants[`${ownerState.variant!}Hover`]?.[ownerState.color!] },
  { '&:active': theme.variants[`${ownerState.variant!}Active`]?.[ownerState.color!] },
  {
    [`&.${chipClasses.disabled}`]:
      theme.variants[`${ownerState.variant!}Disabled`]?.[ownerState.color!],
  },
]);

const ChipStartDecorator = styled('span', {
  name: 'JoyChip',
  slot: 'StartDecorator',
  overridesResolver: (props, styles) => styles.startDecorator,
})<{ ownerState: ChipOwnerState }>({
  '--Avatar-marginInlineStart': 'calc(var(--Chip-decorator-childOffset) * -1)',
  '--Chip-delete-margin': '0 0 0 calc(var(--Chip-decorator-childOffset) * -1)',
  '--Icon-margin': '0 0 0 calc(var(--Chip-paddingInline) / -4)',
  display: 'inherit',
  marginInlineEnd: 'var(--Chip-gap)',
  // set zIndex to 1 with order to stay on top of other controls, eg. Checkbox, Radio
  order: 0,
  zIndex: 1,
  pointerEvents: 'none',
});

const ChipEndDecorator = styled('span', {
  name: 'JoyChip',
  slot: 'EndDecorator',
  overridesResolver: (props, styles) => styles.endDecorator,
})<{ ownerState: ChipOwnerState }>({
  '--Chip-delete-margin': '0 calc(var(--Chip-decorator-childOffset) * -1) 0 0',
  '--Icon-margin': '0 calc(var(--Chip-paddingInline) / -4) 0 0',
  display: 'inherit',
  marginInlineStart: 'var(--Chip-gap)',
  // set zIndex to 1 with order to stay on top of other controls, eg. Checkbox, Radio
  order: 2,
  zIndex: 1,
  pointerEvents: 'none',
});

/**
 * Chips represent complex entities in small blocks, such as a contact.
 */
const Chip = React.forwardRef(function Chip(inProps, ref) {
  const props = useThemeProps<typeof inProps & ChipProps>({ props: inProps, name: 'JoyChip' });
  const {
    children,
    className,
    color: colorProp = 'primary',
    slotProps = {},
    onClick,
    disabled = false,
    size = 'md',
    variant = 'solid',
    startDecorator,
    endDecorator,
    ...other
  } = props;
  const { getColor } = useColorInversion(variant);
  const color = getColor(inProps.color, colorProp);

  const clickable = !!onClick || !!slotProps.action;
  const ownerState: ChipOwnerState = {
    ...props,
    disabled,
    size,
    color,
    variant,
    clickable,
    focusVisible: false,
  };

  const resolvedActionProps =
    typeof slotProps.action === 'function' ? slotProps.action(ownerState) : slotProps.action;
  const actionRef = React.useRef<HTMLElement | null>(null);
  const { focusVisible, getRootProps } = useButton({
    ...resolvedActionProps,
    disabled,
    ref: actionRef,
  });

  ownerState.focusVisible = focusVisible;

  const classes = useUtilityClasses(ownerState);
  const externalForwardedProps = { ...other, slotProps };

  const [SlotRoot, rootProps] = useSlot('root', {
    ref,
    className: clsx(classes.root, className),
    elementType: ChipRoot,
    externalForwardedProps,
    ownerState,
  });

  const [SlotLabel, labelProps] = useSlot('label', {
    className: classes.label,
    elementType: ChipLabel,
    externalForwardedProps,
    ownerState,
  });

  // @ts-ignore internal logic.
  const id = useId(labelProps.id);

  const [SlotAction, actionProps] = useSlot('action', {
    className: classes.action,
    elementType: ChipAction,
    externalForwardedProps,
    ownerState,
    getSlotProps: getRootProps,
    additionalProps: {
      'aria-labelledby': id,
      as: resolvedActionProps?.component,
      onClick,
    },
  });

  const [SlotStartDecorator, startDecoratorProps] = useSlot('startDecorator', {
    className: classes.startDecorator,
    elementType: ChipStartDecorator,
    externalForwardedProps,
    ownerState,
  });

  const [SlotEndDecorator, endDecoratorProps] = useSlot('endDecorator', {
    className: classes.endDecorator,
    elementType: ChipEndDecorator,
    externalForwardedProps,
    ownerState,
  });

  const chipContextValue = React.useMemo(
    () => ({ disabled, variant, color: color === 'context' ? undefined : color }),
    [color, disabled, variant],
  );

  return (
    <ChipContext.Provider value={chipContextValue}>
      <SlotRoot {...rootProps}>
        {clickable && <SlotAction {...actionProps} />}

        {/* label is always the first element for integrating with other controls, eg. Checkbox, Radio. Use CSS order to rearrange position */}
        <SlotLabel {...labelProps} id={id}>
          {children}
        </SlotLabel>
        {startDecorator && (
          <SlotStartDecorator {...startDecoratorProps}>{startDecorator}</SlotStartDecorator>
        )}

        {endDecorator && <SlotEndDecorator {...endDecoratorProps}>{endDecorator}</SlotEndDecorator>}
      </SlotRoot>
    </ChipContext.Provider>
  );
}) as OverridableComponent<ChipTypeMap>;

Chip.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'primary'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'info', 'neutral', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * Element placed after the children.
   */
  endDecorator: PropTypes.node,
  /**
   * Element action click handler.
   */
  onClick: PropTypes.func,
  /**
   * The size of the component.
   * It accepts theme values between 'sm' and 'lg'.
   * @default 'md'
   */
  size: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['lg', 'md', 'sm']),
    PropTypes.string,
  ]),
  /**
   * @ignore
   */
  slotProps: PropTypes.shape({
    action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    endDecorator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    label: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    startDecorator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
  /**
   * Element placed before the children.
   */
  startDecorator: PropTypes.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The variant to use.
   * @default 'solid'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['outlined', 'plain', 'soft', 'solid']),
    PropTypes.string,
  ]),
} as any;

export default Chip;
