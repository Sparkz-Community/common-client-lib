const {RRule, RRuleSet, rrulestr} = require('rrule');

const $lget =require('lodash/get');
const $lset = require('lodash/set');
const $lcloneDeep = require('lodash/cloneDeep');

// eslint-disable-next-line no-unused-vars
export default function (options = {}) {

  let mixin = {
    methods: {
      createRuleSet(rrules = [], startDate) {
        const rruleSet = new RRuleSet();

        rrules.forEach(rule => {
          if (typeof rule === 'string') {
            rule = rrulestr(rule);
          } else {
            let freq = $lget(rule, 'freq');
            if (typeof freq === 'string') $lset(rule, 'freq', RRule[freq]);

            let wkst = $lget(rule, 'wkst');
            if (typeof wkst === 'string') $lset(rule, 'wkst', RRule[wkst]);
            rule = new RRule(rule);
          }

          rruleSet.rrule(rule);
        });
        if (startDate) rruleSet.rdate(startDate);
        return rruleSet;
      },
      checkRrules(
        {
          betweenStartDate,
          betweenEndDate,
          rrules = [],
          returnBool = false,
          startDate,
        } = {}) {
        const rruleSet = this.createRuleSet(rrules, startDate);
        let dates = rruleSet.between(betweenStartDate, betweenEndDate, true);
        return returnBool ? !!dates.length : {dates, isValid: !!dates.length};
      },
      filterEvents(
        {
          events = [],
          startDatePath = 'startDate',
          betweenStartDate,
          betweenEndDate,
          rrulePath = 'rrules',
          setDatesPath,
        } = {}) {
        return events.reduce((acc, curr) => {
          let rrules = $lget(curr, rrulePath, []);
          let res = this.checkRrules({
            betweenStartDate,
            betweenEndDate,
            rrules,
            returnBool: !setDatesPath,
            startDate: $lget(curr, startDatePath),
          });
          let isValid = $lget(res, 'isValid', res);
          if (isValid) {
            if (setDatesPath) $lset(curr, setDatesPath, res.dates);
            acc.push(curr);
          }
          return acc;
        }, []);
      },
      getRruleDates(
        {
          betweenStartDate,
          betweenEndDate,
          startDate,
          rrules = [],
        } = {}) {
        const rruleSet = this.createRuleSet(rrules, startDate);
        let dates = rruleSet.between(betweenStartDate, betweenEndDate, true) || [];
        return dates;
      },
      getAllEventsDates(
        {
          events = [],
          betweenStartDate,
          betweenEndDate,
          startDatePath = 'startDate',
          rrulePath = 'rrules',
          setDatesPath,
        } = {}) {
        return events.reduce((acc, curr) => {
          let rrules = $lget(curr, rrulePath, []);
          let dates = this.getRruleDates({
            betweenStartDate,
            betweenEndDate,
            rrules,
            startDate: $lget(curr, startDatePath),
          });
          if (setDatesPath) {
            $lset(curr, setDatesPath, dates);
            acc.push(curr);
          } else {
            acc = acc.concat(dates).filter((date, i, self) => {
              return self.findIndex(d => d.getTime() === date.getTime()) === i;
            });
          }
          return acc;
        }, []);
      },
      generateRruleEvents(
        {
          events = [],
          betweenStartDate,
          betweenEndDate,
          startDatePath = 'startDate',
          rrulePath = 'rrules',
          setDatePath = 'rruleDate',
        } = {}) {
        return events.reduce((acc, curr) => {
          let rrules = $lget(curr, rrulePath, []);
          let dates = this.getRruleDates({
            betweenStartDate,
            betweenEndDate,
            rrules,
            startDate: $lget(curr, startDatePath),
          });
          if (dates.length) {
            dates.forEach(date => {
              $lset(curr, setDatePath, date);
              acc.push($lcloneDeep(curr));
            });
          } else {
            acc.push(curr);
          }
          return acc;
        }, []);
      },
    },
  };

  // mixin.computed[`${prefix}RouteQueryCust`] = typeof query === 'function' ? query : () => query;

  return mixin;
}
