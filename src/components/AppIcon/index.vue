<template>
  <div class="tr-icon" :style="styles" @click="onClick">
    <i :style="iconStyles" />
    <slot />
  </div>
</template>

<script>
import icons from './icons';

export default {
  name: 'BFIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '16px',
    },
    styles: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      icons,
    };
  },
  computed: {
    iconStyles() {
      return {
        width: this.size,
        height: this.size,
        backgroundImage: `url(${icons[this.name]})`,
      };
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.tr-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
  }
  > i {
    display: block;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
}
</style>
