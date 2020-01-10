module.exports = (post, oldPost) => {
  const nullable = (value) => (typeof value === 'undefined' ? null : value);

  post = {
    ...post,
    locationDetails: (typeof post.locationDetails === 'undefined' || post.locationDetails === null ? {} : post.locationDetails),
    user: (typeof post.user === 'undefined' || post.user === null ? {} : post.user),
  };

  const {
    locationDetails: {
      city,
      region,
      province,
      country,
      district,
      barangay,
      locationLevel,
      placeId,
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
      lat: post.locationDetails.lat,
      long: post.locationDetails.lng,
    },
    postCountry: nullable(country),
    postRegion: nullable(region),
    postProvince: nullable(province),
    postCity: nullable(city),
    postDistrict: nullable(district),
    postBarangay: nullable(barangay),
    locationLevel,
    placeId,
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