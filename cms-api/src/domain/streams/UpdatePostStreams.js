module.exports = (post, oldPost) => {
  const nullable = (value) => (typeof value === 'undefined' ? null : value);
  const tagEmpty = (value) => (value.length ? value : [[]]);
  const stringToArray = (value) => (value ? JSON.parse(value.replace(/'/g, '"')) : []);

  post = {
    ...post,
    locationDetails: (typeof post.locationDetails === 'undefined' || post.locationDetails === null ? {} : post.locationDetails),
    user: (typeof post.user === 'undefined' || post.user === null ? {} : post.user),
  };

  const {
    locations = [],
    tagsRetained = [[]],
    tagsRemoved = [[]],
    tagsAdded = [[]],
    user: {
      firstName,
      lastName,
    },
    status,
    advancedOptions,
  } = post;

  const loc = locations.length ? locations[0] : {};
  const {
    address,
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
    locationLevelScore,
    areaName,
    completeName,
    type,
    subType,
    name,
    street,
    suburb,
    lat,
    lng,
    isGeofence,
    district,
    districtId,
  } = loc;

  const {
    tagsRetained: oldTagsRetained = [[]],
    tagsRemoved: oldTagsRemoved = [[]],
    tagsAdded: oldTagsAdded = [[]],
  } = oldPost;

  const {
    ageFrom = null,
    ageTo = null,
    gender = null,
    deviceType = null,
    deviceBrand = null,
    clientBrand = null,
    brandCredit = null,
  } = advancedOptions || {};

  const author = !firstName || !lastName ? null : `${firstName} ${lastName}`;

  return {
    postId: post.postId,
    postTitle: post.title,
    postFullContent: post.content,
    postTechnicalTags: null,
    postOperationalTags: null,
    postKeywords: tagEmpty([
      ...tagsRetained,
      ...tagsAdded,
    ]),
    postAcceptedKeywords: tagEmpty(tagsRetained),
    postRejectedKeywords: tagEmpty(tagsRemoved),
    postAddedKeywords: tagEmpty(tagsAdded),
    oldPostKeywords: tagEmpty([
      ...oldTagsRetained,
      ...oldTagsAdded,
    ]),
    oldPostAcceptedKeywords: tagEmpty(oldTagsRetained),
    oldPostRejectedKeywords: tagEmpty(oldTagsRemoved),
    oldPostAddedKeywords: tagEmpty(oldTagsAdded),
    postLocation: {
      locationAddress: address,
      lat,
      lng,
    },
    postLocPlaceId: nullable(placeId),
    postLocLocation: nullable(location),
    postLocCountryId: nullable(countryId),
    postLocCountry: nullable(country),
    postLocIslandGroupId: nullable(islandGroupId),
    postLocIslandGroup: nullable(islandGroup),
    postLocMegaRegionId: stringToArray(megaRegionId),
    postLocMegaRegion: stringToArray(megaRegion),
    postLocRegionId: nullable(regionId),
    postLocRegion: nullable(region),
    postLocProvinceId: nullable(provinceId),
    postLocProvince: nullable(province),
    postLocMunicipalityId: nullable(municipalityId),
    postLocMunicipality: nullable(municipality),
    postLocBarangayId: nullable(barangayId),
    postLocBarangay: nullable(barangay),
    postLocLocationLevel: nullable(locationLevel),
    postLocLocationLevelScore: locationLevelScore,
    postLocAreaName: nullable(areaName),
    postLocCompleteName: nullable(completeName),
    postLocType: nullable(type),
    postLocSubType: nullable(subType),
    postLocName: nullable(name),
    postLocStreet: nullable(street),
    postLocSuburb: nullable(suburb),
    postLocDistrict: district,
    postLocDistrictId: districtId,
    postLocAlternateName: [],
    postTimestampPosted: post.publishedAt,
    postTimestampEvent: null,
    postTimestampUpdated: post.updatedAt,
    version: null,
    postCommunityID: null,
    postExpirationDate: post.expiredAt,
    postCategoryId: post.categoryId,
    postSubCategoryId: post.subCategoryId,
    postWordCount: post.title.split(' ').length,
    postCategories: post.category,
    postSubCategory: post.subCategory,
    postGeofencedFlag: nullable(isGeofence),
    sensitivityFlag: null,
    sensitivityType: null,
    sensitivityTypeTimestamp: null,
    dialectTag: null,
    priorityTag: post.priorityLevel,
    brandFlag: null,
    brandName: null,
    brandSafetyType: [],
    sponsorType: null,
    postType: 'Text',
    postSourceType: 'CMS',
    postSource: post.source,
    postAuthor: nullable(author),
    postAgeRestriction: `${ageFrom}-${ageTo}`,
    postGenderRestriction: gender,
    postTarget: null,
    postDeviceType: deviceType,
    postDeviceBrand: deviceBrand,
    postDeviceModel: null,
    postMobileDevice: null,
    postClientBrand: clientBrand,
    postBrandCredit: brandCredit,
    postNetworkRestriction: null,
    postTimeOfDay: null,
    postDayOfWeek: null,
    postOtherRestriction: null,
    postStatus: status,
    reportedFlag: null,
    postScore: null,
    postByLines: [],
  };
};
