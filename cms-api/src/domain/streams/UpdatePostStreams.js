module.exports = (post, oldPost) => {
  const nullable = (value) => (typeof value === 'undefined' ? null : value);

  post = {
    ...post,
    locationDetails: (typeof post.locationDetails === 'undefined' || post.locationDetails === null ? {} : post.locationDetails),
    user: (typeof post.user === 'undefined' || post.user === null ? {} : post.user),
  };

  const {
    locationDetails: {
      placeId,
      location,
      countryId,
      country,
      islandGroupId,
      islandGroup,
      megaRegionId,
      megaRegion,
      regionId,
      region,
      provinceId,
      province,
      municipalityId,
      municipality,
      barangayId,
      barangay,
      locationLevel,
      areaName,
      completeName,
      type,
      subType,
      name,
      street,
      suburb,
      lat,
      lng,
    },
    user: {
      firstName,
      lastName,
    },
  } = post;

  const author = !firstName || !lastName ? null : `${firstName} ${lastName}`;

  const tagsRetained = post.tagsRetained || [];
  const tagsRemoved = post.tagsRemoved || [];
  const tagsAdded = post.tagsAdded || [];

  const oldTagsRetained = oldPost.tagsRetained || [];
  const oldTagsRemoved = oldPost.tagsRemoved || [];
  const oldTagsAdded = oldPost.tagsAdded || [];

  return {
    postId: post.postId,
    postTitle: post.title,
    postFullContent: post.content,
    postKeywords: [
      ...tagsRetained,
      ...tagsAdded,
    ],
    postAcceptedKeywords: tagsRetained,
    postRejectedKeywords: tagsRemoved,
    postAddedKeywords: tagsAdded,
    oldPostKeywords: [
      ...oldTagsRetained,
      ...oldTagsAdded,
    ],
    oldPostAcceptedKeywords: oldTagsRetained,
    oldPostRejectedKeywords: oldTagsRemoved,
    oldPostAddedKeywords: oldTagsAdded,
    postLocation: {
      locationAddress: post.locationAddress,
      lat,
      lng,
    },
    postLocPlaceId: nullable(placeId),
    postLocLocation: nullable(location),
    postLocCountryId: nullable(countryId),
    postLocCountry: nullable(country),
    postLocIslandGroupId: nullable(islandGroupId),
    postLocIslandGroup: nullable(islandGroup),
    postLocMegaRegionId: nullable(megaRegionId),
    postLocMegaRegion: nullable(megaRegion),
    postLocRegionId: nullable(regionId),
    postLocRegion: nullable(region),
    postLocProvinceId: nullable(provinceId),
    postLocProvince: nullable(province),
    postLocMunicipalityId: nullable(municipalityId),
    postLocMunicipality: nullable(municipality),
    postLocBarangayId: nullable(barangayId),
    postLocBarangay: nullable(barangay),
    postLocLocationLevel: nullable(locationLevel),
    postLocAreaName: nullable(areaName),
    postLocCompleteName: nullable(completeName),
    postLocType: nullable(type),
    postLocSubType: nullable(subType),
    postLocName: nullable(name),
    postLocStreet: nullable(street),
    postLocSuburb: nullable(suburb),
    postTimestampPosted: post.publishedAt,
    postTimestampEvent: null,
    postTimestampUpdated: post.updatedAt,
    version: null,
    postCommunityID: null,
    postExpirationDate: null,
    postWordCount: post.title.split(' ').length,
    postCategories: post.category,
    postSubCategory: post.subCategory,
    sensitivityFlag: null,
    sensitivityType: null,
    sensitivityTypeTimestamp: null,
    dialectTag: null,
    priorityTag: post.priorityLevel,
    sponsorFlag: null,
    sponsorName: null,
    sponsorType: null,
    postType: 'Text',
    postSourceType: 'CMS',
    postSource: post.source,
    postAuthor: nullable(author),
    postAgeRestriction: null,
    postGenderRestriction: null,
    postTarget: null,
    postDeviceType: null,
    postDeviceBrand: null,
    postDeviceModel: null,
    postDeviceOS: null,
    postDeviceOSVersion: null,
    postNetworkRestriction: null,
    postTimeOfDay: null,
    postDayOfWeek: null,
    postOtherRestriction: null,
    postStatus: 'Active',
    reportedFlag: null,
    postScore: null,
  };
};
