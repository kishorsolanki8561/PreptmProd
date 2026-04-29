using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonService.Other
{
    public static class AddCache
    {
        //public static void AddCacheBuilder(WebApplicationBuilder builder)
        //{
        //    _ = builder.Services.AddMemoryCache();


        //    //if (AppSettings.enableCache.UseMemoryCache && AppSettings.enableCache.UseRedisCache)
        //    //{
        //    //    _ = builder.Services.AddStackExchangeRedisCache(options =>
        //    //    {
        //    //        options.Configuration = AppSettings.enableCache.RedisCacheURL;
        //    //        options.InstanceName = AppSettings.EnvironmentName;
        //    //    });
        //    //    _ = builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(AppSettings.enableCache.RedisCacheURL));
        //    //}
        //    if (AppSettings.enableCache.UseMemoryCache)
        //    {
        //        _ = builder.Services.AddSingleton<ICacheService, CacheServiceMemory>();
        //    }
        //    else if (AppSettings.enableCache.UseRedisCache)
        //    {
        //        _ = builder.Services.AddStackExchangeRedisCache(options =>
        //        {
        //            options.Configuration = AppSettings.enableCache.RedisCacheURL;
        //            options.InstanceName = AppSettings.EnvironmentName;
        //        });
        //        _ = builder.Services.AddSingleton<ICacheService, CacheServiceRedis>();
        //        _ = builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(AppSettings.enableCache.RedisCacheURL));
        //    }
        //}
    }
}
