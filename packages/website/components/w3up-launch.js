import * as React from 'react';

import { W3upLaunchContext } from './contexts/w3upLaunchContext';
export { W3upLaunchContext } from './contexts/w3upLaunchContext';
export * from '@web3-storage/w3up-launch';

export function useW3upLaunch(context = W3upLaunchContext) {
  return React.useContext(context);
}

/**
 * copy for banner message across top of some web3.storage pages when w3up ships
 * @param {object} props
 * @param {Date} props.sunsetStartDate
 */
export const W3upMigrationRecommendationCopy = ({ sunsetStartDate }) => {
  const createNewAccountHref = 'https://console.web3.storage/?intent=create-account';
  const learnWhatsNewHref = 'https://console.web3.storage/?intent=learn-new-web3storage-experience';
  const sunsetDateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });
  return (
    <>
      This web3.storage product will sunset on {sunsetDateFormatter.format(sunsetStartDate)}. We recommend migrating
      your usage of web3.storage to the new web3.storage.
      <br />
      <a href={createNewAccountHref}>Click here to create a new account</a> and&nbsp;
      <a href={learnWhatsNewHref}>here to read about what’s awesome</a> about the new web3.storage experience.
    </>
  );
};