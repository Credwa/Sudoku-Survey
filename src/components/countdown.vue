<script>
const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;

export default {
  name: 'countdown',

  data() {
    return {
      /**
       * Total number of time (in milliseconds) for the countdown.
       * @type {number}
       */
      count: 0,

      /**
       * Initial count passed down through time prop
       * @type {number}
       */
      initialCount: null,

      /**
       * Define if the time is countdowning.
       * @type {boolean}
       */
      counting: false,

      /**
       * The absolute end time.
       * @type {number}
       */
      endTime: 0,
    };
  },

  props: {
    /**
     * Start to countdown automatically when initialized.
     */
    autoStart: {
      type: Boolean,
      default: true,
    },

    /**
     * Indicate if emit the countdown events or not.
     */
    emitEvents: {
      type: Boolean,
      default: true,
    },

    /**
     * Update interval time (in milliseconds) of the countdown.
     */
    interval: {
      type: Number,
      default: 1000,
    },

    /**
     * Add a leading zero to the output numbers if they are less than 10.
     */
    leadingZero: {
      type: Boolean,
      default: true,
    },

    /**
     * Generate the current time of a specific time zone.
     */
    now: {
      type: Function,
      default: () => Date.now(),
    },

    /**
     * Total number of time (in milliseconds) for the countdown.
     */
    time: {
      type: Number,
      default: 0,
      validator: value => value >= 0,
    },

    /**
     * The tag of the component root element in the countdown.
     */
    tag: {
      type: String,
      default: 'span',
    },
  },

  computed: {
    /**
     * Remaining days.
     * @returns {number}
     */
    days() {
      return Math.floor(this.count / MILLISECONDS_DAY);
    },

    /**
     * Remaining hours.
     * @returns {number}
     */
    hours() {
      return Math.floor((this.count % MILLISECONDS_DAY) / MILLISECONDS_HOUR);
    },

    /**
     * Remaining minutes.
     * @returns {number}
     */
    minutes() {
      return Math.floor((this.count % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
    },

    /**
     * Remaining seconds.
     * @returns {number}
     */
    seconds() {
      const { interval } = this;
      const seconds = (this.count % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND;

      if (interval < 10) {
        return parseFloat(seconds.toFixed(3));
      } else if (interval >= 10 && interval < 100) {
        return parseFloat(seconds.toFixed(2));
      } else if (interval >= 100 && interval < 1000) {
        return parseFloat(seconds.toFixed(1));
      }

      return Math.floor(seconds);
    },

    /**
     * Total remaining days.
     * @returns {number}
     */
    totalDays() {
      return this.days;
    },

    /**
     * Total remaining hours.
     * @returns {number}
     */
    totalHours() {
      return Math.floor(this.count / MILLISECONDS_HOUR);
    },

    /**
     * Total remaining minutes.
     * @returns {number}
     */
    totalMinutes() {
      return Math.floor(this.count / MILLISECONDS_MINUTE);
    },

    /**
     * Total remaining seconds.
     * @returns {number}
     */
    totalSeconds() {
      const { interval } = this;
      const seconds = this.count / MILLISECONDS_SECOND;

      if (interval < 10) {
        return parseFloat(seconds.toFixed(3));
      } else if (interval >= 10 && interval < 100) {
        return parseFloat(seconds.toFixed(2));
      } else if (interval >= 100 && interval < 1000) {
        return parseFloat(seconds.toFixed(1));
      }

      return Math.floor(seconds);
    },
  },

  render(createElement) {
    const preprocess = value =>
      (this.leadingZero && value < 10 ? `0${value}` : value);

    return createElement(
      this.tag,
      this.$scopedSlots.default
        ? [
            this.$scopedSlots.default({
              days: preprocess(this.days),
              hours: preprocess(this.hours),
              minutes: preprocess(this.minutes),
              seconds: preprocess(this.seconds),
              totalDays: preprocess(this.totalDays),
              totalHours: preprocess(this.totalHours),
              totalMinutes: preprocess(this.totalMinutes),
              totalSeconds: preprocess(this.totalSeconds),
            }),
          ]
        : this.$slots.default,
    );
  },

  methods: {
    /**
     * Initialize count.
     */
    init() {
      const { time } = this;

      if (time > 0) {
        this.initialCount = time;
        this.count = time;
        this.endTime = this.now() + time;

        if (this.autoStart) {
          this.$nextTick(() => {
            this.start();
          });
        }
      }
    },

    /**
     * Start to countdown.
     * @public
     * @emits Countdown#countdownstart
     */
    start() {
      if (this.counting) {
        return;
      }

      if (this.emitEvents) {
        /**
         * Countdown start event.
         * @event Countdown#countdownstart
         */
        this.$emit('countdownstart');
      }

      this.counting = true;
      this.next();
    },

    /**
     * Restart to countdown.
     * @public
     * @emits Countdown#countdownrestart
     */
    restart() {
      this.count = this.initalCount;
      this.init();
    },

    /**
     * Helper function - converts milliseconds to seconds
     * @private
     * @emits Countdown#countdowntimeelapsed
     */
    convertToSeconds(time) {
      // const { interval } = this;
      const seconds = (time % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND;

      // if (interval < 10) {
      //   return parseFloat(seconds.toFixed(3));
      // } else if (interval >= 10 && interval < 100) {
      //   return parseFloat(seconds.toFixed(2));
      // } else if (interval >= 100 && interval < 1000) {
      //   return parseFloat(seconds.toFixed(1));
      // }

      return Math.floor(seconds);
    },

    /**
     * Helper function - converts milliseconds to minutes
     * @private
     * @emits Countdown#countdowntimeelapsed
     */
    convertToMinutes(time) {
      return Math.floor((time % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
    },

    /**
     * Helper function - converts milliseconds to minutes
     * @private
     * @emits Countdown#countdowntimeelapsed
     */
    formatTime(time, type) {
      if (time < 10) {
        time = `0${time}`;
        return time;
      }
      return time;
    },

    /**
     * Get time elapsed since countdown began.
     * @public
     * @emits Countdown#countdowntimeelapsed
     */
    getTimeElapsed(elapsed = 0) {
      let timeElapsed;
      if (elapsed > 0) {
        timeElapsed = elapsed;
      } else {
        timeElapsed = this.initialCount - this.count;
      }
      return (
        `${this.formatTime(this.convertToMinutes(timeElapsed))}` +
        `:${this.formatTime(this.convertToSeconds(timeElapsed))}`
      );
    },

    /**
     * Pause countdown.
     * @public
     * @emits Countdown#countdownpause
     */
    pause() {
      if (!this.counting) {
        return;
      }

      if (this.emitEvents) {
        /**
         * Countdown pause event.
         * @event Countdown#countdownpause
         */
        this.$emit('countdownpause');
      }

      this.counting = false;
      clearTimeout(this.timeout);
    },

    /**
     * Next countdown queue.
     * @private
     */
    next() {
      this.timeout = setTimeout(this.step.bind(this), this.interval);
    },

    /**
     * Step to countdown.
     * @private
     * @emits Countdown#countdownprogress
     */
    step() {
      if (!this.counting) {
        return;
      }

      if (this.count > 0) {
        this.count -= this.interval;

        if (this.emitEvents && this.count > 0) {
          /**
           * Countdown progress event.
           * @event Countdown#countdownprogress
           */
          this.$emit('countdownprogress', {
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            totalDays: this.totalDays,
            totalHours: this.totalHours,
            totalMinutes: this.totalMinutes,
            totalSeconds: this.totalSeconds,
          });
        }

        this.next();
      } else {
        this.count = 0;
        this.stop();
      }
    },

    /**
     * Stop the countdown.
     * @public
     * @emits Countdown#countdownend
     */
    stop() {
      this.counting = false;
      clearTimeout(this.timeout);
      this.timeout = undefined;

      if (this.emitEvents) {
        /**
         * Countdown end event.
         * @event Countdown#countdownend
         */
        this.$emit('countdownend');
      }
    },

    /**
     * Update the count.
     * @private
     */
    update() {
      if (this.counting) {
        this.count = Math.max(0, this.endTime - this.now());
      }
    },
  },

  watch: {
    time() {
      this.init();
    },
  },

  created() {
    this.init();
  },

  mounted() {
    window.addEventListener('focus', (this.onFocus = this.update.bind(this)));
  },

  beforeDestroy() {
    window.removeEventListener('focus', this.onFocus);
    clearTimeout(this.timeout);
  },
};
</script>
